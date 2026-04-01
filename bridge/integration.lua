---@type { loadBridge: fun(options: string[][], type: string): table | nil }
local utils = require 'bridge.utils'

---@type string[][]
local options = {
    { 'lb-phone',  'lb-phone',  'lb-phone' },
    { 'yseries',   'yseries',   'yseries' },
    { 'yphone',    'yphone',    'yphone' },
    { 'yflip',     'yflip',     'yflip' },
    { 'gksphone',  'gksphone',  'gksphone' },
    { '17mov_Phone', '17mov_phone', '17mov_phone' },
}

---@type table | nil
local integration = utils.loadBridge(options, 'integrations')

if type(integration) == 'boolean' or not integration then
    error(
        'No supported integration found. Please ensure that you have a supported phone resource installed.'
    )

    return {}
end

return integration
