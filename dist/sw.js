var APP_PREFIX = 'ZombieShooter'       // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = '0.1.0'                  // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                            // Add URL you want to cache in this list.
"/dist/client.js",
"/dist/index.css",
"/dist/index.html",
"/dist/paths.txt",
"/dist/sounds",
"/dist/sw.js",
"/dist/textures",
"/dist/sounds/melee0.wav",
"/dist/sounds/melee1.wav",
"/dist/sounds/melee2.wav",
"/dist/sounds/pistol.wav",
"/dist/sounds/shotgun_pump.wav",
"/dist/sounds/shotgun_reload.wav",
"/dist/sounds/shotgun_shot.wav",
"/dist/sounds/shotgun0.wav",
"/dist/sounds/shotgun1.wav",
"/dist/sounds/survivor_yell",
"/dist/sounds/theme0.mp3",
"/dist/sounds/theme1.mp3",
"/dist/sounds/theme2.mp3",
"/dist/sounds/theme3.mp3",
"/dist/sounds/zombie_hit",
"/dist/sounds/zombie_sound",
"/dist/sounds/zombie-attack0.ogg",
"/dist/sounds/zombie-attack1.ogg",
"/dist/sounds/zombie-attack2.ogg",
"/dist/sounds/survivor_yell/3yell0.wav",
"/dist/sounds/survivor_yell/3yell1.wav",
"/dist/sounds/survivor_yell/3yell2.wav",
"/dist/sounds/survivor_yell/3yell3.wav",
"/dist/sounds/survivor_yell/3yell4.wav",
"/dist/sounds/survivor_yell/3yell5.wav",
"/dist/sounds/survivor_yell/3yell6.wav",
"/dist/sounds/survivor_yell/3yell7.wav",
"/dist/sounds/survivor_yell/3yell8.wav",
"/dist/sounds/survivor_yell/3yell9.wav",
"/dist/sounds/zombie_hit/0.wav",
"/dist/sounds/zombie_hit/1.wav",
"/dist/sounds/zombie_hit/2.wav",
"/dist/sounds/zombie_hit/3.wav",
"/dist/sounds/zombie_sound/0.mp3",
"/dist/sounds/zombie_sound/1.mp3",
"/dist/sounds/zombie_sound/2.mp3",
"/dist/sounds/zombie_sound/3.mp3",
"/dist/sounds/zombie_sound/4.mp3",
"/dist/sounds/zombie_sound/5.mp3",
"/dist/textures/blood_hud",
"/dist/textures/blood_splash",
"/dist/textures/feet",
"/dist/textures/flashlight",
"/dist/textures/handgun",
"/dist/textures/knife",
"/dist/textures/rifle",
"/dist/textures/shoot",
"/dist/textures/shotgun",
"/dist/textures/the_floor",
"/dist/textures/zombie",
"/dist/textures/blood_hud/1.png",
"/dist/textures/blood_hud/2.png",
"/dist/textures/blood_splash/1.png",
"/dist/textures/blood_splash/2.png",
"/dist/textures/blood_splash/3.png",
"/dist/textures/blood_splash/4.png",
"/dist/textures/blood_splash/5.png",
"/dist/textures/blood_splash/6.png",
"/dist/textures/feet/idle",
"/dist/textures/feet/run",
"/dist/textures/feet/strafe_left",
"/dist/textures/feet/strafe_right",
"/dist/textures/feet/walk",
"/dist/textures/feet/idle/survivor-idle_0.png",
"/dist/textures/feet/run/survivor-run_0.png",
"/dist/textures/feet/run/survivor-run_1.png",
"/dist/textures/feet/run/survivor-run_10.png",
"/dist/textures/feet/run/survivor-run_11.png",
"/dist/textures/feet/run/survivor-run_12.png",
"/dist/textures/feet/run/survivor-run_13.png",
"/dist/textures/feet/run/survivor-run_14.png",
"/dist/textures/feet/run/survivor-run_15.png",
"/dist/textures/feet/run/survivor-run_16.png",
"/dist/textures/feet/run/survivor-run_17.png",
"/dist/textures/feet/run/survivor-run_18.png",
"/dist/textures/feet/run/survivor-run_19.png",
"/dist/textures/feet/run/survivor-run_2.png",
"/dist/textures/feet/run/survivor-run_3.png",
"/dist/textures/feet/run/survivor-run_4.png",
"/dist/textures/feet/run/survivor-run_5.png",
"/dist/textures/feet/run/survivor-run_6.png",
"/dist/textures/feet/run/survivor-run_7.png",
"/dist/textures/feet/run/survivor-run_8.png",
"/dist/textures/feet/run/survivor-run_9.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_0.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_1.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_10.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_11.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_12.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_13.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_14.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_15.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_16.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_17.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_18.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_19.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_2.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_3.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_4.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_5.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_6.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_7.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_8.png",
"/dist/textures/feet/strafe_left/survivor-strafe_left_9.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_0.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_1.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_10.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_11.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_12.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_13.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_14.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_15.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_16.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_17.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_18.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_19.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_2.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_3.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_4.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_5.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_6.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_7.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_8.png",
"/dist/textures/feet/strafe_right/survivor-strafe_right_9.png",
"/dist/textures/feet/walk/survivor-walk_0.png",
"/dist/textures/feet/walk/survivor-walk_1.png",
"/dist/textures/feet/walk/survivor-walk_10.png",
"/dist/textures/feet/walk/survivor-walk_11.png",
"/dist/textures/feet/walk/survivor-walk_12.png",
"/dist/textures/feet/walk/survivor-walk_13.png",
"/dist/textures/feet/walk/survivor-walk_14.png",
"/dist/textures/feet/walk/survivor-walk_15.png",
"/dist/textures/feet/walk/survivor-walk_16.png",
"/dist/textures/feet/walk/survivor-walk_17.png",
"/dist/textures/feet/walk/survivor-walk_18.png",
"/dist/textures/feet/walk/survivor-walk_19.png",
"/dist/textures/feet/walk/survivor-walk_2.png",
"/dist/textures/feet/walk/survivor-walk_3.png",
"/dist/textures/feet/walk/survivor-walk_4.png",
"/dist/textures/feet/walk/survivor-walk_5.png",
"/dist/textures/feet/walk/survivor-walk_6.png",
"/dist/textures/feet/walk/survivor-walk_7.png",
"/dist/textures/feet/walk/survivor-walk_8.png",
"/dist/textures/feet/walk/survivor-walk_9.png",
"/dist/textures/flashlight/idle",
"/dist/textures/flashlight/meleeattack",
"/dist/textures/flashlight/move",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_0.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_1.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_10.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_11.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_12.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_13.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_14.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_15.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_16.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_17.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_18.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_19.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_2.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_3.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_4.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_5.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_6.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_7.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_8.png",
"/dist/textures/flashlight/idle/survivor-idle_flashlight_9.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_0.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_1.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_10.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_11.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_12.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_13.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_14.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_2.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_3.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_4.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_5.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_6.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_7.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_8.png",
"/dist/textures/flashlight/meleeattack/survivor-meleeattack_flashlight_9.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_0.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_1.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_10.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_11.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_12.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_13.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_14.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_15.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_16.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_17.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_18.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_19.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_2.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_3.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_4.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_5.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_6.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_7.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_8.png",
"/dist/textures/flashlight/move/survivor-move_flashlight_9.png",
"/dist/textures/handgun/idle",
"/dist/textures/handgun/meleeattack",
"/dist/textures/handgun/move",
"/dist/textures/handgun/reload",
"/dist/textures/handgun/shoot",
"/dist/textures/handgun/idle/survivor-idle_handgun_0.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_1.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_10.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_11.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_12.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_13.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_14.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_15.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_16.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_17.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_18.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_19.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_2.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_3.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_4.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_5.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_6.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_7.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_8.png",
"/dist/textures/handgun/idle/survivor-idle_handgun_9.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_0.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_1.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_10.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_11.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_12.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_13.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_14.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_2.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_3.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_4.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_5.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_6.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_7.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_8.png",
"/dist/textures/handgun/meleeattack/survivor-meleeattack_handgun_9.png",
"/dist/textures/handgun/move/survivor-move_handgun_0.png",
"/dist/textures/handgun/move/survivor-move_handgun_1.png",
"/dist/textures/handgun/move/survivor-move_handgun_10.png",
"/dist/textures/handgun/move/survivor-move_handgun_11.png",
"/dist/textures/handgun/move/survivor-move_handgun_12.png",
"/dist/textures/handgun/move/survivor-move_handgun_13.png",
"/dist/textures/handgun/move/survivor-move_handgun_14.png",
"/dist/textures/handgun/move/survivor-move_handgun_15.png",
"/dist/textures/handgun/move/survivor-move_handgun_16.png",
"/dist/textures/handgun/move/survivor-move_handgun_17.png",
"/dist/textures/handgun/move/survivor-move_handgun_18.png",
"/dist/textures/handgun/move/survivor-move_handgun_19.png",
"/dist/textures/handgun/move/survivor-move_handgun_2.png",
"/dist/textures/handgun/move/survivor-move_handgun_3.png",
"/dist/textures/handgun/move/survivor-move_handgun_4.png",
"/dist/textures/handgun/move/survivor-move_handgun_5.png",
"/dist/textures/handgun/move/survivor-move_handgun_6.png",
"/dist/textures/handgun/move/survivor-move_handgun_7.png",
"/dist/textures/handgun/move/survivor-move_handgun_8.png",
"/dist/textures/handgun/move/survivor-move_handgun_9.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_0.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_1.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_10.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_11.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_12.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_13.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_14.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_2.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_3.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_4.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_5.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_6.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_7.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_8.png",
"/dist/textures/handgun/reload/survivor-reload_handgun_9.png",
"/dist/textures/handgun/shoot/survivor-shoot_handgun_0.png",
"/dist/textures/handgun/shoot/survivor-shoot_handgun_1.png",
"/dist/textures/handgun/shoot/survivor-shoot_handgun_2.png",
"/dist/textures/knife/idle",
"/dist/textures/knife/meleeattack",
"/dist/textures/knife/move",
"/dist/textures/knife/idle/survivor-idle_knife_0.png",
"/dist/textures/knife/idle/survivor-idle_knife_1.png",
"/dist/textures/knife/idle/survivor-idle_knife_10.png",
"/dist/textures/knife/idle/survivor-idle_knife_11.png",
"/dist/textures/knife/idle/survivor-idle_knife_12.png",
"/dist/textures/knife/idle/survivor-idle_knife_13.png",
"/dist/textures/knife/idle/survivor-idle_knife_14.png",
"/dist/textures/knife/idle/survivor-idle_knife_15.png",
"/dist/textures/knife/idle/survivor-idle_knife_16.png",
"/dist/textures/knife/idle/survivor-idle_knife_17.png",
"/dist/textures/knife/idle/survivor-idle_knife_18.png",
"/dist/textures/knife/idle/survivor-idle_knife_19.png",
"/dist/textures/knife/idle/survivor-idle_knife_2.png",
"/dist/textures/knife/idle/survivor-idle_knife_3.png",
"/dist/textures/knife/idle/survivor-idle_knife_4.png",
"/dist/textures/knife/idle/survivor-idle_knife_5.png",
"/dist/textures/knife/idle/survivor-idle_knife_6.png",
"/dist/textures/knife/idle/survivor-idle_knife_7.png",
"/dist/textures/knife/idle/survivor-idle_knife_8.png",
"/dist/textures/knife/idle/survivor-idle_knife_9.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_0.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_1.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_10.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_11.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_12.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_13.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_14.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_2.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_3.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_4.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_5.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_6.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_7.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_8.png",
"/dist/textures/knife/meleeattack/survivor-meleeattack_knife_9.png",
"/dist/textures/knife/move/survivor-move_knife_0.png",
"/dist/textures/knife/move/survivor-move_knife_1.png",
"/dist/textures/knife/move/survivor-move_knife_10.png",
"/dist/textures/knife/move/survivor-move_knife_11.png",
"/dist/textures/knife/move/survivor-move_knife_12.png",
"/dist/textures/knife/move/survivor-move_knife_13.png",
"/dist/textures/knife/move/survivor-move_knife_14.png",
"/dist/textures/knife/move/survivor-move_knife_15.png",
"/dist/textures/knife/move/survivor-move_knife_16.png",
"/dist/textures/knife/move/survivor-move_knife_17.png",
"/dist/textures/knife/move/survivor-move_knife_18.png",
"/dist/textures/knife/move/survivor-move_knife_19.png",
"/dist/textures/knife/move/survivor-move_knife_2.png",
"/dist/textures/knife/move/survivor-move_knife_3.png",
"/dist/textures/knife/move/survivor-move_knife_4.png",
"/dist/textures/knife/move/survivor-move_knife_5.png",
"/dist/textures/knife/move/survivor-move_knife_6.png",
"/dist/textures/knife/move/survivor-move_knife_7.png",
"/dist/textures/knife/move/survivor-move_knife_8.png",
"/dist/textures/knife/move/survivor-move_knife_9.png",
"/dist/textures/rifle/idle",
"/dist/textures/rifle/meleeattack",
"/dist/textures/rifle/move",
"/dist/textures/rifle/reload",
"/dist/textures/rifle/shoot",
"/dist/textures/rifle/idle/survivor-idle_rifle_0.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_1.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_10.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_11.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_12.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_13.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_14.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_15.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_16.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_17.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_18.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_19.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_2.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_3.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_4.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_5.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_6.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_7.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_8.png",
"/dist/textures/rifle/idle/survivor-idle_rifle_9.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_0.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_1.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_10.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_11.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_12.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_13.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_14.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_2.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_3.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_4.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_5.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_6.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_7.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_8.png",
"/dist/textures/rifle/meleeattack/survivor-meleeattack_rifle_9.png",
"/dist/textures/rifle/move/survivor-move_rifle_0.png",
"/dist/textures/rifle/move/survivor-move_rifle_1.png",
"/dist/textures/rifle/move/survivor-move_rifle_10.png",
"/dist/textures/rifle/move/survivor-move_rifle_11.png",
"/dist/textures/rifle/move/survivor-move_rifle_12.png",
"/dist/textures/rifle/move/survivor-move_rifle_13.png",
"/dist/textures/rifle/move/survivor-move_rifle_14.png",
"/dist/textures/rifle/move/survivor-move_rifle_15.png",
"/dist/textures/rifle/move/survivor-move_rifle_16.png",
"/dist/textures/rifle/move/survivor-move_rifle_17.png",
"/dist/textures/rifle/move/survivor-move_rifle_18.png",
"/dist/textures/rifle/move/survivor-move_rifle_19.png",
"/dist/textures/rifle/move/survivor-move_rifle_2.png",
"/dist/textures/rifle/move/survivor-move_rifle_3.png",
"/dist/textures/rifle/move/survivor-move_rifle_4.png",
"/dist/textures/rifle/move/survivor-move_rifle_5.png",
"/dist/textures/rifle/move/survivor-move_rifle_6.png",
"/dist/textures/rifle/move/survivor-move_rifle_7.png",
"/dist/textures/rifle/move/survivor-move_rifle_8.png",
"/dist/textures/rifle/move/survivor-move_rifle_9.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_0.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_1.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_10.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_11.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_12.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_13.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_14.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_15.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_16.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_17.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_18.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_19.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_2.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_3.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_4.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_5.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_6.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_7.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_8.png",
"/dist/textures/rifle/reload/survivor-reload_rifle_9.png",
"/dist/textures/rifle/shoot/survivor-shoot_rifle_0.png",
"/dist/textures/rifle/shoot/survivor-shoot_rifle_1.png",
"/dist/textures/rifle/shoot/survivor-shoot_rifle_2.png",
"/dist/textures/shoot/shoot",
"/dist/textures/shoot/shoot/muzzle_flash_0.png",
"/dist/textures/shotgun/idle",
"/dist/textures/shotgun/meleeattack",
"/dist/textures/shotgun/move",
"/dist/textures/shotgun/reload",
"/dist/textures/shotgun/shoot",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_0.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_1.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_10.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_11.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_12.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_13.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_14.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_15.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_16.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_17.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_18.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_19.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_2.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_3.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_4.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_5.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_6.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_7.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_8.png",
"/dist/textures/shotgun/idle/survivor-idle_shotgun_9.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_0.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_1.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_10.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_11.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_12.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_13.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_14.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_2.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_3.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_4.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_5.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_6.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_7.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_8.png",
"/dist/textures/shotgun/meleeattack/survivor-meleeattack_shotgun_9.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_0.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_1.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_10.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_11.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_12.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_13.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_14.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_15.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_16.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_17.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_18.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_19.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_2.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_3.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_4.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_5.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_6.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_7.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_8.png",
"/dist/textures/shotgun/move/survivor-move_shotgun_9.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_0.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_1.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_10.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_11.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_12.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_13.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_14.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_15.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_16.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_17.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_18.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_19.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_2.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_3.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_4.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_5.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_6.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_7.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_8.png",
"/dist/textures/shotgun/reload/survivor-reload_shotgun_9.png",
"/dist/textures/shotgun/shoot/survivor-shoot_shotgun_0.png",
"/dist/textures/shotgun/shoot/survivor-shoot_shotgun_1.png",
"/dist/textures/shotgun/shoot/survivor-shoot_shotgun_2.png",
"/dist/textures/the_floor/the_floor",
"/dist/textures/the_floor/the_floor/barrel.png",
"/dist/textures/the_floor/the_floor/blood_0.png",
"/dist/textures/the_floor/the_floor/crate_1.png",
"/dist/textures/the_floor/the_floor/floor_2.png",
"/dist/textures/zombie/attack",
"/dist/textures/zombie/idle",
"/dist/textures/zombie/move",
"/dist/textures/zombie/attack/skeleton-attack_0.png",
"/dist/textures/zombie/attack/skeleton-attack_1.png",
"/dist/textures/zombie/attack/skeleton-attack_2.png",
"/dist/textures/zombie/attack/skeleton-attack_3.png",
"/dist/textures/zombie/attack/skeleton-attack_4.png",
"/dist/textures/zombie/attack/skeleton-attack_5.png",
"/dist/textures/zombie/attack/skeleton-attack_6.png",
"/dist/textures/zombie/attack/skeleton-attack_7.png",
"/dist/textures/zombie/attack/skeleton-attack_8.png",
"/dist/textures/zombie/idle/skeleton-idle_0.png",
"/dist/textures/zombie/idle/skeleton-idle_1.png",
"/dist/textures/zombie/idle/skeleton-idle_10.png",
"/dist/textures/zombie/idle/skeleton-idle_11.png",
"/dist/textures/zombie/idle/skeleton-idle_12.png",
"/dist/textures/zombie/idle/skeleton-idle_13.png",
"/dist/textures/zombie/idle/skeleton-idle_14.png",
"/dist/textures/zombie/idle/skeleton-idle_15.png",
"/dist/textures/zombie/idle/skeleton-idle_16.png",
"/dist/textures/zombie/idle/skeleton-idle_2.png",
"/dist/textures/zombie/idle/skeleton-idle_3.png",
"/dist/textures/zombie/idle/skeleton-idle_4.png",
"/dist/textures/zombie/idle/skeleton-idle_5.png",
"/dist/textures/zombie/idle/skeleton-idle_6.png",
"/dist/textures/zombie/idle/skeleton-idle_7.png",
"/dist/textures/zombie/idle/skeleton-idle_8.png",
"/dist/textures/zombie/idle/skeleton-idle_9.png",
"/dist/textures/zombie/move/skeleton-move_0.png",
"/dist/textures/zombie/move/skeleton-move_1.png",
"/dist/textures/zombie/move/skeleton-move_10.png",
"/dist/textures/zombie/move/skeleton-move_11.png",
"/dist/textures/zombie/move/skeleton-move_12.png",
"/dist/textures/zombie/move/skeleton-move_13.png",
"/dist/textures/zombie/move/skeleton-move_14.png",
"/dist/textures/zombie/move/skeleton-move_15.png",
"/dist/textures/zombie/move/skeleton-move_16.png",
"/dist/textures/zombie/move/skeleton-move_2.png",
"/dist/textures/zombie/move/skeleton-move_3.png",
"/dist/textures/zombie/move/skeleton-move_4.png",
"/dist/textures/zombie/move/skeleton-move_5.png",
"/dist/textures/zombie/move/skeleton-move_6.png",
"/dist/textures/zombie/move/skeleton-move_7.png",
"/dist/textures/zombie/move/skeleton-move_8.png",
"/dist/textures/zombie/move/skeleton-move_9.png",
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})