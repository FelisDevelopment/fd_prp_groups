---@type table
local config = require 'config.general'

---@param source number
---@param text string
---@param type? 'success' | 'error' | 'info'
local function sendNotification(source, text, type)
    exports["gksphone"]:sendNotification(source, {
        title = config.appName,
        message = text,
        icon = ("https://cfx-nui-%s/web/dist/groups.png"):format(GetCurrentResourceName()),
        duration = 5000,
        type = type or 'info',
        buttonactive = false,
    })
end

return {
    sendNotification = sendNotification,
}
