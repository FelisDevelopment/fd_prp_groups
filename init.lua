local general = require 'config.general'

lib.locale()
---@type table
shared = {}

if not IsDuplicityVersion() then
    ---@type table
    client = {}
    return
end

if not general.isDevelopment and not LoadResourceFile(GetCurrentResourceName(), 'web/dist/index.html') then
    return error('Theres no built UI.\n\t^3fd_prp_groups^0', 0)
end

---@type table
server = {}

if general.isDevelopment or general.debug then
    SetConvarReplicated(("ox:printlevel:%s"):format(GetCurrentResourceName()), "debug")
end
