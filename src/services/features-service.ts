import { inject, injectable } from "inversify";
import { Locator } from "@root/locator";

import { IFeaturesRepository } from "@repositories/features-repository";
import CustomException from "@entities/exceptions/custom-exception";
import FeatureModel from "@models/ground/feature";
import { Geometry, MultiPolygon, Polygon, Position } from "geojson";
import Utils from "@utils/utils";
import { createHash } from "crypto";
import FeatureEntity from "@entities/requests/feature-request";
import FeatureMapper from "@mappers/feature.mapper";
import CropModel from "@models/crops/crop";
import { ICropsRepository } from "@repositories/crops-repository";

export interface IFeaturesService {
    insertNewFeature(feature: FeatureEntity): Promise<any>;
    fetchSingleFeature(feature_id: string): Promise<FeatureEntity>;
    fetchSingleFeatureFromHash(feature_hash: string): Promise<FeatureEntity>;
    listFeaturesFromUser(user_uuid: string, crops_filter: string): Promise<FeatureEntity[]>;
}

@injectable()
export class FeaturesService implements IFeaturesService {
    _PORT: string;
    private _utils: Utils;
    
    constructor(
        @inject(Locator.IFeaturesRepository) private featuresRepository: IFeaturesRepository,
        @inject(Locator.ICropsRepository) private cropsRepository: ICropsRepository,
    ) {
        this._PORT = process.env.PORT || String(8800);
        this._utils = new Utils();
    }

    async insertNewFeature(feature: FeatureEntity): Promise<any> {
        // Se por algum motivo o talhão vier vazio, devolver erro
        if (!feature) {
            throw new CustomException(
                "INVALID_DATA",
                "Deve haver um valor válido para 'feature'."
            );
        }
        
        // Geometrias permitidas
        const allowed_geometries: string[] = [
            "Polygon", "MultiPolygon"
        ];
        
        // Se geometria não for permitida, devolver erro
        if (!allowed_geometries.includes(feature.geometry.type)) {
            throw new CustomException(
                "INVALID_DATA",
                "Só é possível fazer o upload dos seguintes tipos de geometria: Polygon e MultiPolygon"
            );
        }

        // Gera uma hash com base nas coordenadas do talhão
        const feature_coordinates = (feature.geometry as Polygon | MultiPolygon).coordinates;
        const feature_hash: string = this.generateFeatureHash(feature_coordinates);
        
        // Procura um talhão com a hash gerada
        const existent_feature: FeatureModel<Geometry> = await this.featuresRepository.fetchFeatureFromHash(feature_hash);

        // Se talhão já existir com a hash, devolver erro
        if (!!existent_feature) {
            throw new CustomException(
                "INVALID_DATA",
                "Talhão já existente."
            );
        }

        // Busca o tipo de cultivo
        const crop: CropModel = await this.cropsRepository.fetchCrop(feature.properties.feature.crop.id);

        if (!crop) {
            throw new CustomException(
                "ITEM_NOT_FOUND",
                "Não foi possível localizar o tipo de cultivo. Tenha certeza que o cultivo existe."
            );
        }
        
        // Faz o mapeamento da entidade para o modelo de banco de dados
        const feature_model: typeof existent_feature = FeatureMapper.toModel(feature);

        // Insere informações que só o back-end tem acesso
        feature_model.properties.user.id = "50b87973-2957-427b-8476-38d67e39e867";
        feature_model.properties.feature.hash = feature_hash;
        feature_model.properties.feature.crop.name = crop.name;
        
        // Insere o talhão e retorna o ID (ObjectId)
        const feature_id = await this.featuresRepository.insertFeature(feature_model);

        // Se não foi possível inserir
        if (!feature_id) {
            throw new CustomException(
                "INTERNAL",
                "Houve um erro ao inserir o talhão. Tente novamente mais tarde."
            );
        }
        
        // Retorna o ID e hash do talhão criado
        return {
            feature_id,
            feature_hash
        };
    }

    private generateFeatureHash(coordinates: Position[][] | Position[][][]): string {
        // Converte as coordenadas para uma string JSON sem formatação extra, assim possibilitando o front-end de criar o mesmo hash
        const coordinatesString = JSON.stringify(coordinates, null, 0);
        
        // Cria um hash usando o algoritmo SHA-256
        const hash = createHash("sha256");
        hash.update(coordinatesString);
        
        // Retorna o hash em formato hexadecimal
        return hash.digest("hex");
    }
    
    async fetchSingleFeature(feature_id: string): Promise<FeatureEntity> {
        // Se o ID do talhão vier vazio, devolver erro
        if (feature_id.trim().length === 0) {
            throw new CustomException(
                "INVALID_DATA",
                "Deve haver um valor válido para 'feature_id'."
            );
        }

        // Busca o modelo
        const feature_model = await this.featuresRepository.fetchFeature(feature_id);

        // Se não encontrar o talhão, devolver erro
        if (!feature_model) {
            throw new CustomException("ITEM_NOT_FOUND");
        }

        // Mapeia o modelo para uma entidade que pode ser respondida sem informações sensiveis e retorna
        const entity = FeatureMapper.toEntity(feature_model)
        return entity;
    }

    async fetchSingleFeatureFromHash(feature_hash: string): Promise<FeatureEntity> {
        // Se o hash do talhão vier errado, devolver erro
        if (!this._utils.isValidHash(feature_hash)) {
            throw new CustomException(
                "INVALID_DATA",
                "Deve haver um valor válido para 'feature_hash'."
            );
        }

        // Busca o modelo
        const feature_model = await this.featuresRepository.fetchFeatureFromHash(feature_hash);

        // Se não encontrar o talhão, devolver erro
        if (!feature_model) {
            throw new CustomException("ITEM_NOT_FOUND");
        }

        // Mapeia o modelo para uma entidade que pode ser respondida sem informações sensiveis e retorna
        const entity = FeatureMapper.toEntity(feature_model)
        return entity;
    }

    async listFeaturesFromUser(user_uuid: string, crops_filter: string): Promise<FeatureEntity[]> {
        // Se o uuid do usuário vier errado, devolver erro
        if (!user_uuid.trim())
        {
            throw new CustomException(
                "INVALID_DATA",
                "O parâmetro 'user_uuid' deve estar no formato adequado."
            );
        }
        
        // Escaneia o filtro de cultivo (divido por uma barra vertical "<string>|<string>")
        const crops_id: string[] = crops_filter ? crops_filter?.trim().split("|") : [];
        
        // Busca os modelos
        const features = await this.featuresRepository.listFeaturesFromUser(user_uuid, crops_id);

        // Se não encontrar um sequer talhão, devolver erro
        if (!features) {
            throw new CustomException("ITEMS_NOT_FOUND");
        }

        // Faz a conversão/mapeamento de todos os modelos para entidades
        return features.map(feature => {
            return FeatureMapper.toEntity(feature);
        });
    }
}