import { Container } from "inversify";
import { Locator } from "./locator";
import "reflect-metadata";

import { IFeaturesRepository, FeaturesRepository } from "@repositories/features-repository";
import { IFeaturesService, FeaturesService } from "@/services/features-service";

export const container = new Container();

// facilitar: sempre que eu invocar essa interface -> a partir desse Locator -> vou passar essa classe
// container.bind<I_Repository>(Locator.I_Repository).to(_Repository);
// container.bind<I_Repository>(Locator.I_Service).to(_Service);

container.bind<IFeaturesRepository>(Locator.IFeaturesRepository).to(FeaturesRepository);
container.bind<IFeaturesService>(Locator.IFeaturesService).to(FeaturesService);

container.bind<FeaturesService>(FeaturesService).toSelf()