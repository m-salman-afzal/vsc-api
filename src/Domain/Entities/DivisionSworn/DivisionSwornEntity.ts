import {SWORN_PERSONNEL_DIVISION_TYPES} from "@appUtils/Constants";
import SharedUtils from "@appUtils/SharedUtils";

export interface IDivisionSwornEntity {
    divisionSwornId: string;
    title: string;
    dsp: number;
    dsj: number;
    dsr: number;
    mds: number;
    cpl: number;
    sgt: number;
    lt: number;
    cap: number;
    maj: number;
    ltCol: number;
    col: number;
    dcr: number;
    chd: number;
    year: string;
    category: string;
    facilityId: string;
    position: number;
}

interface DivisionSwornEntity extends IDivisionSwornEntity {}

class DivisionSwornEntity {
    constructor(divisionSwornEntity: IDivisionSwornEntity) {
        this.divisionSwornId = divisionSwornEntity.divisionSwornId;
        this.title = divisionSwornEntity.title ? divisionSwornEntity.title.trim() : divisionSwornEntity.title;
        this.dsp = divisionSwornEntity.dsp ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.dsp) : null;
        this.dsj = divisionSwornEntity.dsj ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.dsj) : null;
        this.dsr = divisionSwornEntity.dsr ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.dsr) : null;
        this.mds = divisionSwornEntity.mds ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.mds) : null;
        this.cpl = divisionSwornEntity.cpl ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.cpl) : null;
        this.sgt = divisionSwornEntity.sgt ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.sgt) : null;
        this.lt = divisionSwornEntity.lt ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.lt) : null;
        this.cap = divisionSwornEntity.cap ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.cap) : null;
        this.maj = divisionSwornEntity.maj ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.maj) : null;
        this.ltCol = divisionSwornEntity.ltCol ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.ltCol) : null;
        this.col = divisionSwornEntity.col ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.col) : null;
        this.dcr = divisionSwornEntity.dcr ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.dcr) : null;
        this.chd = divisionSwornEntity.chd ? SharedUtils.cleanFloatNumbers(divisionSwornEntity.chd) : null;
        this.year = divisionSwornEntity.year;
        this.category = divisionSwornEntity.category;
        this.facilityId = divisionSwornEntity.facilityId;
        this.position = divisionSwornEntity.position;
    }

    static create(divisionSwornEntity) {
        return new DivisionSwornEntity(divisionSwornEntity);
    }

    static publicFields(divisionSwornEntity) {
        const isNested = !!divisionSwornEntity.title.split("|")[1];

        return {
            title: isNested ? divisionSwornEntity.title.split("|")[1].trim() : divisionSwornEntity.title,
            watch: divisionSwornEntity.category,
            divisionType: SWORN_PERSONNEL_DIVISION_TYPES.SWORN_PERSONNEL_DIVISION,
            isNested: isNested,
            year: divisionSwornEntity.year,
            dsp: divisionSwornEntity.dsp,
            dsj: divisionSwornEntity.dsj,
            dsr: divisionSwornEntity.dsr,
            mds: divisionSwornEntity.mds,
            cpl: divisionSwornEntity.cpl,
            sgt: divisionSwornEntity.sgt,
            lt: divisionSwornEntity.lt,
            cap: divisionSwornEntity.cap,
            maj: divisionSwornEntity.maj,
            ltCol: divisionSwornEntity.ltCol,
            col: divisionSwornEntity.col,
            dcr: divisionSwornEntity.dcr,
            chd: divisionSwornEntity.chd
        };
    }
}

export default DivisionSwornEntity;
