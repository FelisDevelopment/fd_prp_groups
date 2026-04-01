local side = IsDuplicityVersion() and 'server' or 'client'

---@param options table<string, string, string>[]
---@param type 'frameworks' | 'inventories' | 'targets' | 'integrations'
local function loadBridge(options, type)
    local bridge = nil

    for _, data in pairs(options) do
        local resource, bridgeLocation, name = table.unpack(data)

        if GetResourceState(resource) ~= 'started' then goto continue end

        local bridgePath = ("bridge.%s.%s.%s"):format(type, bridgeLocation, side)
        local resourceFilePath = ('%s.lua'):format(bridgePath:gsub('%.', '/'))

        if not LoadResourceFile(GetCurrentResourceName(), resourceFilePath) then goto continue end

        lib.print.info(('Loading ^2%s^0 bridge.'):format(name))
        bridge = require(bridgePath)
        bridge.name = name

        break

        ::continue::
    end

    return bridge
end

return {
    loadBridge = loadBridge
}
