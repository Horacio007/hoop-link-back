export interface ErrorHandleDB {
    query?:           string;
    parameters?:      Array<string[] | number | string>;
    driverError?:     ErrorHandleDB;
    length:           number;
    severity:         string;
    code:             string;
    detail:           string;
    hint:             string;
    position:         string;
    internalPosition: string;
    internalQuery:    string;
    where:            string;
    schema:           string;
    table:            string;
    column:           string;
    dataType:         string;
    constraint:       string;
    file:             string;
    line:             string;
    routine:          string;
}
