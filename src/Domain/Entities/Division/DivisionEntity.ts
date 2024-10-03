import SharedUtils from "@appUtils/SharedUtils";

export interface IDivisionEntity {
    divisionId: string;
    title: string;
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
    year: string;
    watch: string;
    isBold: boolean;
    divisionType: string;
    facilityId: string;
    position: number;
}

interface DivisionEntity extends IDivisionEntity {}

class DivisionEntity {
    constructor(divisionEntity: IDivisionEntity) {
        this.divisionId = divisionEntity.divisionId;
        this.title = divisionEntity.title ? divisionEntity.title.trim() : divisionEntity.title;
        this.watch = divisionEntity.watch ? divisionEntity.watch.trim() : divisionEntity.watch;
        this.jan = `${divisionEntity.jan}` ? SharedUtils.cleanFloatNumbers(divisionEntity.jan) : null;
        this.feb = `${divisionEntity.feb}` ? SharedUtils.cleanFloatNumbers(divisionEntity.feb) : null;
        this.mar = `${divisionEntity.mar}` ? SharedUtils.cleanFloatNumbers(divisionEntity.mar) : null;
        this.apr = `${divisionEntity.apr}` ? SharedUtils.cleanFloatNumbers(divisionEntity.apr) : null;
        this.may = `${divisionEntity.may}` ? SharedUtils.cleanFloatNumbers(divisionEntity.may) : null;
        this.jun = `${divisionEntity.jun}` ? SharedUtils.cleanFloatNumbers(divisionEntity.jun) : null;
        this.jul = `${divisionEntity.jul}` ? SharedUtils.cleanFloatNumbers(divisionEntity.jul) : null;
        this.aug = `${divisionEntity.aug}` ? SharedUtils.cleanFloatNumbers(divisionEntity.aug) : null;
        this.sep = `${divisionEntity.sep}` ? SharedUtils.cleanFloatNumbers(divisionEntity.sep) : null;
        this.oct = `${divisionEntity.oct}` ? SharedUtils.cleanFloatNumbers(divisionEntity.oct) : null;
        this.nov = `${divisionEntity.nov}` ? SharedUtils.cleanFloatNumbers(divisionEntity.nov) : null;
        this.dec = `${divisionEntity.dec}` ? SharedUtils.cleanFloatNumbers(divisionEntity.dec) : null;
        this.year = divisionEntity.year;
        this.isBold = divisionEntity.isBold;
        this.divisionType = divisionEntity.divisionType;
        this.facilityId = divisionEntity.facilityId;
        this.position = divisionEntity.position;
    }

    static create(divisionEntity) {
        return new DivisionEntity(divisionEntity);
    }

    static publicFields(divisionEntity) {
        const isNested = !!divisionEntity.title.split("|")[1];

        return {
            title: isNested ? divisionEntity.title.split("|")[1].trim() : divisionEntity.title,
            watch: divisionEntity.watch,
            divisionType: divisionEntity.divisionType,
            isBold: divisionEntity.isBold,
            isNested: isNested,
            year: divisionEntity.year,
            [`jan${divisionEntity.year}`]: divisionEntity.jan,
            [`feb${divisionEntity.year}`]: divisionEntity.feb,
            [`mar${divisionEntity.year}`]: divisionEntity.mar,
            [`apr${divisionEntity.year}`]: divisionEntity.apr,
            [`may${divisionEntity.year}`]: divisionEntity.may,
            [`jun${divisionEntity.year}`]: divisionEntity.jun,
            [`jul${divisionEntity.year}`]: divisionEntity.jul,
            [`aug${divisionEntity.year}`]: divisionEntity.aug,
            [`sep${divisionEntity.year}`]: divisionEntity.sep,
            [`oct${divisionEntity.year}`]: divisionEntity.oct,
            [`nov${divisionEntity.year}`]: divisionEntity.nov,
            [`dec${divisionEntity.year}`]: divisionEntity.dec
        };
    }
}

export default DivisionEntity;
