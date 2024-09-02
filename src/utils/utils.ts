import CustomException from '@entities/exceptions/custom-exception';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

class Utils {
    constructor() {}

    generateBufferFromImage(base64_image: string): Buffer {
        if (base64_image === null || base64_image.length === 0) {
            throw new CustomException('INVALID_DATA');
        }
        
        const base64Data = base64_image.replace(/^data:image\/\w+;base64,/, "");
        const buffer: Buffer = Buffer.from(base64Data, "base64");
        return buffer;
    }
    
    writeTempFile(file_name: string, path: string, buffer: Buffer): string {
        const tempFilePath: string = join(path, file_name);
        writeFileSync(tempFilePath, buffer);
        return tempFilePath;
    }

    discardTempFile(temp_file_path: string): void {
        unlinkSync(temp_file_path);
    }

    isValidHash(hash: string): boolean {
        // Se estiver vazio
        if (hash.trim().length === 0) return false;

        // Se o formato não bater
        const regex: RegExp = /^[a-fA-F0-9]{64}$/;
        if (!regex.test(hash)) return false;

        // Tudo certo
        return true;
    }

    isValidUUIDv4(uuid: string): boolean {
        // Se o formato não bater
        const regex: RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        if (!regex.test(uuid)) return false;

        // Tudo certo
        return true;
    }
}

export default Utils;