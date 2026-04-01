---@type table
local config = require 'config.general'

---@param source number
---@param text string
---@param type? 'success' | 'error' | 'info'
local function sendNotification(source, text, type)
    exports['17mov_Phone']:SendNotificationToSrc(source, {
        app = config.appId,
        title = config.appName,
        message = text,
    })
end

return {
    sendNotification = sendNotification,
}
