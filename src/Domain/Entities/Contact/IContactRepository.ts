import type {ContactEntity} from "@entities/Contact/ContactEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {Contact} from "@infrastructure/Database/Models/Contact";
import type {Facility} from "@infrastructure/Database/Models/Facility";
import type {Process} from "@infrastructure/Database/Models/Process";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TSearchFilters} from "@typings/ORM";

export interface IContactRepository extends IBaseRepository<Contact, ContactEntity> {
    fetchByQuery(searchFilters: TSearchFilters<Contact>): Promise<false | Contact>;
    fetchAllByQuery(searchFilters: TSearchFilters<Contact>): Promise<false | Contact[]>;
    fetchPaginatedBySearchQuery(
        searchFilters: TSearchFilters<Contact>,
        pagination: PaginationOptions
    ): Promise<
        | false
        | {
              count: number;
              rows: Contact[];
          }
    >;

    fetchContactFacilitiesProcessSearchQuery(
        searchFilters: Omit<TSearchFilters<Contact & Facility & Process>, "contactId"> & {contactId?: string[]}
    ): Promise<false | Contact[]>;
}
