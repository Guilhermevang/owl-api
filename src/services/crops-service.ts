import { inject, injectable } from "inversify";
import { Locator } from "@root/locator";

import CustomException from "@entities/exceptions/custom-exception";
import FeatureModel from "@models/ground/feature";
import Utils from "@utils/utils";
import CropModel from "@models/crops/crop";
import CropRequest from "@entities/requests/crop-request";
import CropMapper from "@mappers/crop.mapper";
import { ICropsRepository } from "@repositories/crops-repository";
import CropResponse from "@entities/responses/crop-response";

export interface ICropsService {
    insertNewCrop(crop: CropRequest): Promise<any>;
    fetchSingleCrop(crop_id: string): Promise<CropResponse>
}

@injectable()
export class CropsService implements ICropsService {
    _PORT: string;
    private _utils: Utils;
    
    constructor(
        @inject(Locator.ICropsRepository) private cropsRepository: ICropsRepository,
    ) {
        this._PORT = process.env.PORT || String(8800);
        this._utils = new Utils();
    }

    async insertNewCrop(crop: CropRequest): Promise<any> {
        // Se por algum motivo o cultivo vier vazio, devolver erro
        if (!crop) {
            throw new CustomException(
                "INVALID_DATA",
                "Deve haver um valor válido para 'feature'."
            );
        }

        // Faz o mapeamento da entidade para o modelo de banco de dados
        const crop_model: CropModel = CropMapper.toModel(crop);
        
        // Insere o cultivo e retorna o ID (ObjectId)
        const crop_id = await this.cropsRepository.insertCrop(crop_model);

        // Se não foi possível inserir
        if (!crop_id) {
            throw new CustomException(
                "INTERNAL",
                "Houve um erro ao inserir o tipo de cultivo. Tente novamente mais tarde."
            );
        }
        
        // Retorna o ID do cultivo criado
        return {
            crop_id
        };
    }

    async fetchSingleCrop(crop_id: string): Promise<CropResponse> {
        // Se o ID do cultivo vier vazio, devolver erro
        if (crop_id.trim().length === 0) {
            throw new CustomException(
                "INVALID_DATA",
                "Deve haver um valor válido para 'crop_id'."
            );
        }

        // Busca o modelo
        const crop_model = await this.cropsRepository.fetchCrop(crop_id);

        // Se não encontrar o cultivo, devolver erro
        if (!crop_model) {
            throw new CustomException("ITEM_NOT_FOUND");
        }

        // Mapeia o modelo para uma entidade que pode ser respondida sem informações sensiveis e retorna
        const entity = CropMapper.toResponse(crop_model)
        return entity;
    }

    async listCrops(): Promise<CropResponse[]> {
        // Busca os modelos
        const crops = await this.cropsRepository.listCrops();

        // Se não encontrar um sequer tipo de cultivo, devolver erro
        if (!crops) {
            throw new CustomException("ITEMS_NOT_FOUND");
        }

        // Faz a conversão/mapeamento de todos os modelos para entidades
        return crops.map(crop => {
            return CropMapper.toResponse(crop);
        });
    }
}