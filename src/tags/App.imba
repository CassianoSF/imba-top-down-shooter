tag Undead < svg:g
    attr transform
    prop player
    prop game
    prop zombie
    prop zombies

    def render
        zombie.update player, game, zombies
        <self transform=("translate({zombie.pos:x},{zombie.pos:y}) rotate({zombie.rotation})")>
            <svg:g transform="translate({-50}, {-50})">
                <svg:rect transform="scale({zombie.animation.adjust:scale}) translate({zombie.animation.adjust:translate})" height=100 width=100 fill="url(#zombie-{zombie.animation.path}-{~~(game.time/zombie.animation.frame-length % zombie.animation.size)})">
                if zombie.taking-hit
                    <svg:g transform=("rotate(-90) translate({-100}, {-50})")>
                        <svg:rect height=100 width=100 fill="url(#blood-splash-{zombie.taking-hit})">

tag Survival < svg:g
    attr transform
    prop player
    prop game

    def render
        <self transform="translate({ window:innerWidth/2 + player.pos:x}, { window:innerHeight/2 + player.pos:y}) rotate({player.rotation})">
            <Shot gun=player.gun> if player.shooting
            <svg:g transform="translate({-50}, {-50})">
                <svg:rect transform="scale({player.feet-animation.adjust:scale}) translate({player.feet-animation.adjust:translate})" height=100 width=100 fill="url(#{player.feet-animation.name}-{~~(game.time/player.feet-animation.frame-length) % player.feet-animation.size})">
                <svg:rect transform="scale({player.animation.adjust:scale}) translate({player.animation.adjust:translate})" height=100 width=100 fill="url(#{player.animation.name}-{~~(game.time/player.animation.frame-length) % player.animation.size})">

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
        bullet.update zombies, game, player
        <self transform="translate({ window:innerWidth/2 + bullet.pos:x}, { window:innerHeight/2 - bullet.pos:y}) rotate({bullet.direction})">
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
            if player.taking-hit
                <svg:g transform="translate({game.width/2}, {game.height/2})">
                    <svg:rect transform=("rotate({player.blood-rotation})") .blood-hud height=game.height/1.5 width=game.width/1.5 fill="url(#blood-hud-{player.taking-hit})">

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
        survival-animations = loadSurvivalAnimations
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
        player.shoot           if game.keys:leftbutton
        player.attack(zombies) if game.keys:rightbutton
        game.width = window:innerWidth
        game.height = window:innerHeight
        let directions = []
        directions.push :left  if game.keys:KeyA
        directions.push :right if game.keys:KeyD
        directions.push :down  if game.keys:KeyS
        directions.push :up    if game.keys:KeyW
        player.running = game.keys:ShiftLeft
        player.move directions
        game.time += 1
        render

    def loadSurvivalAnimations
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
        let x = player.shooting ? Math.random*15 - 7.5 : 0
        let y = player.shooting ? Math.random*15 - 7.5 : 0
        <self .container>
            <svg:svg .game transform="scale(1,-1)">
                survival-animations
                feet-animation
                <Loader>

                if Object.keys(images-loaded):length == 440 and Object.keys(audios-loaded):length == 27
                    <svg:g transform=("translate({x - player.pos:x}, {y - player.pos:y})")>
                        <Ground player=player>
                        <Survival player=player game=game>
                        for zombie in zombies
                            <Undead zombies=zombies zombie=zombie player=player game=game> if zombie
                        for bullet in player.bullets
                            <Projectile bullet=bullet player=player zombies=zombies game=game> if bullet
                        # for box in game.boxes
                        #     <Box box=box>
                        # for barrel in game.barrels
                        #     <Barrel barrel=barrel>
                    <Hud player=player game=game>
                    <Aim crosshair=crosshair>
                else
                    <svg:g transform="translate({window:innerWidth/2},{window:innerHeight/2}) scale(1, -1)">
                        <svg:text fill="black">
                            "LOADING.... {~~(Object.keys(images-loaded):length/8.8 + Object.keys(audios-loaded):length/0.54)}%"
                    <svg:g transform="translate({window:innerWidth/2},{window:innerHeight/2 + 100}) scale(1, -1)">
                        <svg:text fill="black">
                            "Tip: ZoomOut to 80%"