export interface ErrorHandleDB {
    query:       string;
    parameters:  Array<number | string>;
    driverError: DriverError;
    code:        string;
    errno:       number;
    sqlState:    string;
    sqlMessage:  string;
    sql:         string;
}

export interface DriverError {
    name:       string;
    message:    string;
    stack:      string[];
    code:       string;
    errno:      number;
    sqlState:   string;
    sqlMessage: string;
}

