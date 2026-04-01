---@type table
local config = require 'config.general'
local isAppReady = false

local function RegisterApp()
    local resourceName = GetCurrentResourceName()

    exports['17mov_Phone']:AddApplication({
        name = config.appId,
        label = config.appName,
        ui = config.isDevelopment and 'https://localhost:5173/' or
            ('https://cfx-nui-%s/web/dist/index.html'):format(resourceName),
        icon = ("https://cfx-nui-%s/web/dist/groups.svg"):format(resourceName),
        iconBackground = {
            angle = 45,
            colors = { "#0B1203", "#0B1203" },
        },
        default = config.defaultApp,
        preInstalled = true,
        resourceName = resourceName,
    })

    isAppReady = true
    lib.print.debug('Groups app added.')
end

CreateThread(function()
    if GetResourceState('17mov_Phone') == 'started' then
        RegisterApp()
    end
end)

RegisterNetEvent('17mov_Phone:Client:Ready', function()
    RegisterApp()
end)

---@param text string
---@param type? 'success' | 'error' | 'info'
local function sendNotification(text, type)
    exports['17mov_Phone']:CreateNotification({
        app = config.appId,
        title = config.appName,
        message = text,
    })
end

---@param action string
---@param data any
local function sendAppUpdate(action, data)
    if not isAppReady then return end

    exports['17mov_Phone']:SendAppMessage(config.appId, {
        action = action,
        payload = data
    })
end

local function closeDevice()
    exports['17mov_Phone']:ClosePhone()
end

local function openDevice()
    exports['17mov_Phone']:OpenPhone()
end

return {
    sendAppUpdate = sendAppUpdate,
    sendNotification = sendNotification,
    closeDevice = closeDevice,
    openDevice = openDevice,
    zoom = 0.85,
}
