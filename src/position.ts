import { FileInput, logger } from "./logger";

export class Position {
    constructor(
        public line: number,
		public column: number,
		public index: number
    ) {}

    public branch(): Position {
        return new Position(this.line, this.column, this.index);
    }

    public merge({ line, column, index }: Position) {
        this.line = line;
        this.column = column;
        this.index = index;
    }

    public advance(amount: number) {
        // Forward: function test():
        // Advance: 8

        const { file } = logger;
        let advance = file.input.substring(this.index, this.index + amount);
        let index;
    
        this.index += amount;

        // console.log(`Advancing by`, amount);
        // console.log(`Advanced:`, advance);
        // console.log(`Rest:`, file.input.substring(this.index));
        
        while ((index = advance.indexOf("\n")) !== -1) {
            advance = advance.substring(index + 1);
            this.line++;
        }

        // console.log(`${this.line}:${this.column}`);
    
        this.column = advance.length;
    }

    public getLine(input: string): string {
        const start = input.substring(0, this.index).lastIndexOf("\n") + 1;
        const end = input.substring(this.index).indexOf("\n");

        return input.substring(start, end);
    }
}