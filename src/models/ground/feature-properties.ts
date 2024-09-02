export class UserFeatureProperties {
    constructor(
        public id: string,
    ) {}
}

export class ThisFeatureProperties {
    constructor(
        public hash: string,
        public name: string,
        public crop: CropFeatureProperties,
    ) {}
}

export class CropFeatureProperties {
    constructor(
        public id: string,
        public name: string,
    ) {}
}

export default class FeaturePropertiesModel {
    constructor(
        public user: UserFeatureProperties,
        public feature: ThisFeatureProperties,
    ) {}
}