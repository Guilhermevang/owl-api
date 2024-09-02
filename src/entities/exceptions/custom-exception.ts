import ErrorCode from "./../enums/error-code";

class CustomException {
    private _status_code: number = 500;

    public get status_code(): number {
        return this._status_code;
    }

    private set status_code(status: number) {
        this._status_code = status;
    }

    constructor(
        public error_code: ErrorCode,
        public error_description: string | null = null,
    ) {
        if (error_description === null) {
            this.describeError();
        }

        this.setStatusCode();
    }

    describeError(): void {
        switch (this.error_code) {
            case "INTERNAL":
                this.error_description = "Houve um erro interno."
            case "INVALID_DATA":
                this.error_description = "Os dados fornecidos no corpo da requisição são inválidos.";
                break;
            case "FEATURES_NOT_FOUND":
                this.error_description = "Nenhum talhão encontrado.";
                break;
            case "FEATURE_NOT_FOUND":
                this.error_description = "Talhão não encontrado.";
                break;
            default:
                this.error_description = "Houve um erro não tratado.";
                break;
        }
    }

    setStatusCode():void {
        switch (this.error_code) {
            case "INTERNAL":
                this.status_code = 500;
                break;
            case "INVALID_DATA":
                this.status_code = 400;
                break;
            case "FEATURES_NOT_FOUND":
                this.status_code = 400;
                break;
            case "FEATURE_NOT_FOUND":
                this.status_code = 400;
                break;
            default:
                this.status_code = 500;
                break;
        }
    }

    toJson(): object {
        return {
            error_code: this.error_code,
            error_description: this.error_description,
        }
    }
}

export default CustomException;