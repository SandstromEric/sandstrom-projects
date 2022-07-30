export interface TalentTrees {
    class: {
        name: string;
        staticTalents: Map<string, TalentStatic>,
        dynamicTalents: Map<string, TalentDynamic>,
        connections: string[][],
        maxPoints: number,
        spentPoints: number,
    },
    spec: {
        name: string;
        staticTalents: Map<string, TalentStatic>,
        dynamicTalents: Map<string, TalentDynamic>,
        connections: string[][],
        maxPoints: number,
        spentPoints: number,
    }
}

export interface TalentStatic {
    talent: number, 
    spellId: number,
    points: number,
    row: number,
    col: number,
    cell: number,
    type: number,
    icon: string,
    connections: string[],
    nextTalents: string[],
    requiresMinPoints: number,
    checkpoints: number[],
}

export interface TalentDynamic { 
    spent: number,
    available: boolean,
}

export interface TalentTreeResponse {
    class: {
        name: string,
        talents: TalentStatic[],
        connections: number[]
    },
    spec: {
        name: string,
        talents: TalentStatic[],
        connections: number[]
    }
}