---@type table
local config = require 'config.general'

CreateThread(function()
    while GetResourceState("gksphone") ~= "started" do
        Wait(500)
    end

    exports["gksphone"]:AddCustomApp({
        name = config.appId,
        description = config.appDescription,
        icons = ("https://cfx-nui-%s/web/dist/groups.png"):format(GetCurrentResourceName()),
        appurl = config.isDevelopment and 'https://localhost:5173/' or
            ('https://cfx-nui-%s/web/dist/index.html'):format(GetCurrentResourceName()),
        url = '/customapp',
        blockedjobs = {},
        allowjob = {},
        signal = true,
        show = true,
        labelLangs = {
            af = config.appName,
            ar = config.appName,
            cs = config.appName,
            de = config.appName,
            en = config.appName,
            es = config.appName,
            fr = config.appName,
            id = config.appName,
            nl = config.appName,
            ["pt-PT"] = config.appName,
            ro = config.appName,
            sv = config.appName,
            th = config.appName,
            tr = config.appName,
            uk = config.appName,
            ["zh-TW"] = config.appName
        }
    })
end)

---@param text string
---@param type? 'success' | 'error' | 'info'
local function sendNotification(text, type)
    exports["gksphone"]:Notification({
        title = config.appName,
        message = text,
    })
end

---@param action string
---@param data any
local function sendAppUpdate(action, data)
    exports["gksphone"]:NuiSendMessage({
        action = action,
        data = data
    })
end

local function closeDevice()
    exports["gksphone"]:PhoneClose()
end

local function openDevice()
    exports["gksphone"]:PhoneOpen()
end

return {
    sendAppUpdate = sendAppUpdate,
    sendNotification = sendNotification,
    closeDevice = closeDevice,
    openDevice = openDevice,
}
