package api

type ErrorCode string

const ErrAccountLocked ErrorCode = "ACCOUNT_LOCKED"

type ErrorResponse struct { Code ErrorCode `json:"code"` }
