// Forced ENVs to match sample files.
// Only for hardcoded tests, not for production use.
process.env.ACCOUNT_ID = '110700000000000_WHATSAPP_BUSINESS_ACCOUNT_ID'
process.env.PHONE_NUMBER_ID = '119900000000000_WHATSAPP_PHONE_NUMBER_ID'

require('./extract-data');