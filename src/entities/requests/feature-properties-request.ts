export class ThisFeaturePropertiesEntity {
    constructor(
        public name: string,
        public crop: CropFeaturePropertiesEntity,
    ) {}
}

export class CropFeaturePropertiesEntity {
    constructor(
        public id: string
    ) {}
}

export default class FeaturePropertiesEntity {
    constructor(
        public feature: ThisFeaturePropertiesEntity,
    ) {}
}