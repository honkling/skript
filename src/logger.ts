import { Position } from "./position";

export class FileInput {
    constructor(
        public name: string,
        public input: string
    ) {}
}

export class Logger {
    public logs = new Map<FileInput, [string, boolean][]>();
    public position: Position;
    public file: FileInput;

    public setFile(file: FileInput) {
        this.file = file;
        this.position = new Position(1, 1, 0);
    }

    public warn(message: string, inFile: boolean = true) {
        const suffix = this.getSuffix(inFile);
        const contents = this.getContents(inFile);
    
        this.initialize().push([`\x1b[33mwarning: \x1b[0m${message}${suffix}${contents}`, false]);
    }
    
    public error(message: string, inFile: boolean = true) {
        const suffix = this.getSuffix(inFile);
        const contents = this.getContents(inFile);
    
        this.initialize().push([`\x1b[31merror: \x1b[0m${message}${suffix}${contents}`, true]);
    }

    public release(): boolean {
        let hadErrors = false;

        for (const logs of this.logs.values()) {
            for (const index in logs) {
                const [log, isError] = logs[index];

                if (isError)
                    hadErrors = true;

                console.log(log, parseInt(index) + 1 < logs.length ? "\n" : "");
            }
        }

        this.logs.clear();
        return hadErrors;
    }
    
    private getSuffix(inFile: boolean): string {
        return inFile
            ? ` (${this.file.name}:${this.position.line}:${this.position.column})`
            : "";
    }
    
    private getContents(inFile: boolean): string {
        return inFile ? "\ntodo: file contents" : "";
    }
    
    private initialize(): [string, boolean][] {
        if (!this.logs.has(this.file))
            this.logs.set(this.file, []);
    
        return this.logs.get(this.file);
    }
}

export const logger = new Logger();