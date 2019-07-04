tag Undead < svg:g
    attr transform
    prop player
    prop game
    prop zombie
    prop zombies

    def render
        <self transform=("translate({zombie.pos:x},{zombie.pos:y}) rotate({zombie.rotation})")>
            <svg:g transform="translate({-50}, {-50})">
                <svg:rect transform="scale({zombie.animation.adjust:scale}) translate({zombie.animation.adjust:translate})" height=100 width=100 fill="url(#zombie-{zombie.animation.path}-{~~(game.time/zombie.animation.frame-length % zombie.animation.size)})">
                if zombie.taking-hit
                    <svg:g transform=("rotate(-90) translate({-100}, {-50})")>
                        <svg:rect height=100 width=100 fill="url(#blood-splash-{zombie.taking-hit})">

tag Survivor < svg:g
    attr transform
    prop player
    prop game

    def render
        <self transform="translate({player.pos:x}, {player.pos:y}) rotate({player.rotation})">
            <Shot gun=player.gun> if player.shooting
            <svg:g transform="translate({-50}, {-50})">
                <svg:rect 
                    height=100 width=100 
                    transform="scale({player.feet-animation.adjust:scale}) translate({player.feet-animation.adjust:translate})"
                    fill="url(#{player.feet-animation.name}-{~~(game.time/player.feet-animation.frame-length) % player.feet-animation.size})">
                <svg:rect 
                    height=100 width=100 
                    transform="scale({player.animation.adjust:scale}) translate({player.animation.adjust:translate})"
                    fill="url(#{player.animation.name}-{~~(game.time/player.animation.frame-length) % player.animation.size})">

tag Ground < svg:g
    prop player
    attr height
    attr width
    attr transform

    def render
        <self height=70000 width=70000 transform="translate({ - 35000},{ - 35000})">
            <svg:g>
                <svg:rect height=70000 width=70000 fill="url(#floor_2)" stroke="white">

tag Shot < svg:g
    attr transform
    prop rotation
    prop gun

    def render
        <self>
            if gun.name == :handgun
                <svg:rect transform="translate(30, -25)" height=100 width=100 fill="url(#shot)">
            elif gun.name == :rifle or gun.name == :shotgun
                <svg:rect transform="translate(55, -30)" height=100 width=100 fill="url(#shot)">

tag Projectile < svg:g
    attr transform
    prop bullet
    prop player
    prop zombies
    prop game

    def render
        <self transform="translate({bullet.pos:x}, {bullet.pos:y}) rotate({bullet.direction})">
            <svg:rect height=1 width=50 fill="yellow">

tag Aim < svg:g
    attr transform
    prop crosshair

    def render
        <self transform="translate({crosshair.x}, {crosshair.y + window:innerHeight})">
            <svg:circle r=10 stroke="rgb(60,255,60)">
            <svg:circle r=8 fill="rgb(60,255,60)">
            <svg:circle r=2 fill="black">

tag Hud < svg:g
    attr height
    attr width
    prop player
    prop game

    def render
        <self>
            <svg:g transform="translate({game.width - 300}, {game.height/10})">
                <svg:g transform="scale(1,-1)">
                    <svg:text .noselect fill="yellow" font-family="MenofNihilist" font-size="50">
                        "life {player.life}"
                <svg:g transform="scale(1,-1) translate(0,50)">
                    <svg:text .noselect fill=(player.gun.ammo < player.gun.cap/3 ? "red" : "yellow") font-family="MenofNihilist" font-size="50">
                        "ammo {player.gun.ammo}"
            if player.taking-hit
                <svg:g transform="translate({game.width/2}, {game.height/2})">
                    <svg:rect .blood-hud 
                        transform=("rotate({player.blood-rotation})") 
                        height=game.height/1.5 width=game.width/1.5 
                        fill="url(#blood-hud-{player.taking-hit})">

tag Barrel < svg:g
    attr transform
    prop barrel

    def render
        <self transform="translate({barrel:x},{barrel:y}) rotate({barrel:rotation})">
            <svg:g transform="translate({-25}, {-25})">
                <svg:rect height=50 width=50 fill="url(#barrel)">

tag Box < svg:g
    attr transform
    prop box

    def render
        <self transform="translate({box:x},{box:y}) rotate({box:rotation})">
            <svg:g transform="translate({-50}, {-50})">
                <svg:rect height=100 width=100 fill="url(#box)">

tag Loader < svg:g

    def render
        <self>
            # FLOOR
            <svg:defs>
                <svg:pattern #floor_2 patternUnits="userSpaceOnUse" width="700" height="700" patternContentUnits="userSpaceOnUse">
                    <svg:image href="textures/the_floor/the_floor/floor_2.png" width="700" height="700">

            # MUZZLE FLASH
            <svg:defs>
                <svg:pattern #shot patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                    <svg:image href="textures/shoot/shoot/muzzle_flash_0.png" width="100" height="100">
            # BARREL
            <svg:defs>
                <svg:pattern id="barrel" patternUnits="userSpaceOnUse" width="50" height="50" patternContentUnits="userSpaceOnUse">
                    <svg:image href="textures/the_floor/the_floor/barrel.png" width="50" height="50">
            # BOX
            <svg:defs>
                <svg:pattern id="box" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                    <svg:image href="textures/the_floor/the_floor/crate_1.png" width="100" height="100">

            # BLOOD HUD
            <svg:defs>
                <svg:pattern id="blood-hud-1" patternUnits="userSpaceOnUse" width="{window:innerWidth/2}" height="{window:innerHeight/2}" patternContentUnits="userSpaceOnUse">
                    <svg:image href="textures/blood_hud/1.png" width="{window:innerWidth/2}" height="{window:innerHeight/2}">
            <svg:defs>
                <svg:pattern id="blood-hud-2" patternUnits="userSpaceOnUse" width="{window:innerWidth/2}" height="{window:innerHeight/2}" patternContentUnits="userSpaceOnUse">
                    <svg:image href="textures/blood_hud/2.png" width="{window:innerWidth/2}" height="{window:innerHeight/2}">

            # BLOOD SPLASH
            for a, i in Array.from(Array.new(6))
                <svg:defs>
                    <svg:pattern id="blood-splash-{i+1}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/blood_splash/{i+1}.png" width="100" height="100">
            
            # ZOMBIE ANIMATIONS
            for a, i in Array.from(Array.new(17))
                <svg:defs>
                    <svg:pattern id="zombie-idle-{i}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/zombie/idle/skeleton-idle_{i}.png" width="100" height="100">

            for a, i in Array.from(Array.new(17))
                <svg:defs>
                    <svg:pattern id="zombie-move-{i}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/zombie/move/skeleton-move_{i}.png" width="100" height="100">

            for a, i in Array.from(Array.new(9))
                <svg:defs>
                    <svg:pattern id="zombie-attack-{i}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/zombie/attack/skeleton-attack_{i}.png" width="100" height="100">

export tag App
    prop survival-animations
    prop feet-animation
    prop images-loaded default: {}
    prop audios-loaded default: {}

    prop crosshair
    prop zombies
    prop player
    prop guns
    prop animations
    prop audios
    prop boxes
    prop barrels
    prop game

    def mount
        survival-animations = loadSurvivorAnimations
        feet-animation = loadFeetAnimations
        render
        let images = Array.from(document.getElementsByTagName('image'))
        for i in images
            i:onload = do images-loaded[i:attributes:href:value] = true

        for k, audio of audios
            audio:oncanplaythrough = do audios-loaded[k] = true

        schedule interval: 16
        game.initListners

    def tick
        game.update
        render

    def loadSurvivorAnimations
        for gun, anims of animations:player
            for action, anim of anims
                for a, i in Array.from(Array.new(anim.size))
                    <svg:defs>
                        <svg:pattern id="{anim.name}-{i}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                            <svg:image href="{anim.path}{i}.png" width="100" height="100">

    def loadFeetAnimations
        for name, anim of animations:feet
            for a, i in Array.from(Array.new(anim.size))
                <svg:defs>
                    <svg:pattern id="{anim.name}-{i}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="{anim.path}{i}.png" width="100" height="100">

    def render
        let x = player.shooting ? Math.random * player.gun.power - player.gun.power/2 : 0
        let y = player.shooting ? Math.random * player.gun.power - player.gun.power/2 : 0
        <self .container>
            <svg:svg .game transform="scale(1,-1)">
                survival-animations
                feet-animation
                <Loader>

                if Object.keys(images-loaded):length == 440 and Object.keys(audios-loaded):length == Object.keys(audios):length
                    <svg:g transform=("translate({x - player.pos:x + game.width/2}, {y - player.pos:y + game.height/2})")>
                        <Ground player=player>
                        for box in game.boxes
                            <Box box=box>
                        for barrel in game.barrels
                            <Barrel barrel=barrel>
                        <Survivor player=player game=game>
                        for zombie in zombies
                            <Undead zombies=zombies zombie=zombie player=player game=game> if zombie
                        for bullet in player.bullets
                            <Projectile bullet=bullet player=player zombies=zombies game=game> if bullet
                    <Hud player=player game=game>
                    <Aim crosshair=crosshair>
                else
                    <svg:g transform="translate({window:innerWidth/4},{window:innerHeight/2}) scale(1, -1)">
                        <svg:text fill="red" font-family="MenofNihilist" font-size="150">
                            "Zombie Shooter"
                    <svg:g transform="translate({window:innerWidth/3},{window:innerHeight/3}) scale(1, -1)">
                        <svg:text fill="red" font-family="MenofNihilist" font-size="90">
                            "LOADING.... {~~(Object.keys(images-loaded):length/440 * 40 + Object.keys(audios-loaded):length/Object.keys(audios):length * 60)}%"
                    <svg:g transform="translate({window:innerWidth/2},{window:innerHeight/4}) scale(1, -1)">
                        <svg:text fill="red" font-family="MenofNihilist" font-size="15">
                            "Tip: ZoomOut to 80%"
                    <svg:g transform="translate({window:innerWidth - 200},{window:innerHeight - 200}) scale(1, -1)">
                        <svg:text fill="red" font-family="MenofNihilist" font-size="15">
                            "built with imba"