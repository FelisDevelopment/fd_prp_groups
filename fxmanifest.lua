fx_version 'cerulean'
use_experimental_fxv2_oal 'yes'
game 'gta5'

author 'coblyox'
description 'Groups phopne app for prp-bridge'
version '1.0.1'

dependencies {
    '/onesync',
    'ox_lib',
    'prp-bridge'
}

files {
    'web/dist/index.html',
    'web/dist/**/*',
    'locales/*.json',
    'config/*',
    'bridge/**/client.lua',
    'bridge/**/server.lua',
    'bridge/*.lua',
    'composables/client/*.lua',
    'composables/shared/*.lua',
}

shared_scripts {
    '@ox_lib/init.lua',
    '@prp-bridge/import.lua',
    'init.lua'
}

client_scripts {
    'modules/**/client.lua',
}

server_scripts {
    'modules/**/server.lua',
}
