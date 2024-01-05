import { Position } from "./position";

export class FileInput {
    constructor(
        public name: string,
        public input: string
    ) {}
}

export class Logger {
    public logs = new Map<FileInput, string[]>();
    public position: Position;
    public file: FileInput;

    public setFile(file: FileInput) {
        this.file = file;
        this.position = new Position(1, 1, 0);
    }

    public warn(message: string, inFile: boolean = true) {
        const suffix = this.getSuffix(inFile);
        const contents = this.getContents(inFile);
    
        this.initialize().push(`\x1b[33mwarning: \x1b[0m${message}${suffix}${contents}`);
    }
    
    public error(message: string, inFile: boolean = true) {
        const suffix = this.getSuffix(inFile);
        const contents = this.getContents(inFile);
    
        this.initialize().push(`\x1b[33merror: \x1b[0m${message}${suffix}${contents}`);
    }

    public release() {
        for (const logs of this.logs.values()) {
            for (const log of logs)
                console.log(log, "\n");
        }

        this.logs.clear();
    }
    
    private getSuffix(inFile: boolean): string {
        return inFile
            ? `(${this.file.name}:${this.position.line}:${this.position.column})`
            : "";
    }
    
    private getContents(inFile: boolean): string {
        return inFile ? "\ntodo: file contents" : "";
    }
    
    private initialize(): string[] {
        if (!this.logs.has(this.file))
            this.logs.set(this.file, []);
    
        return this.logs.get(this.file);
    }
}

export const logger = new Logger();