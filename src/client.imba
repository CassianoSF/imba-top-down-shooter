tag Player < svg:g
    attr transform
    prop pos
    prop rotation
    prop time default: 0
    prop shoot

    def mount
        schedule interval: 30

    def tick
        time++
        render

    def render
        <self transform="translate(500, 350) rotate({rotation})">
            <Shot rotation=rotation> if shoot
            <svg:g transform="translate({-50}, {-50})">
                <svg:defs>
                    <svg:pattern #survivor patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/handgun/move/survivor-move_handgun_{time % 19}.png" width="100" height="100">
                <svg:rect height=100 width=100 fill="url(#survivor)">

tag Ground < svg:g
    prop pos
    attr height
    attr width
    attr transform

    def render
        <self height=70000 width=70000 transform="translate({-pos:x - 35000},{-pos:y - 35000})">
            <svg:g>
                <svg:defs>
                    <svg:pattern #floor_2 patternUnits="userSpaceOnUse" width="700" height="700" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/the_floor/the_floor/floor_2.png" width="700" height="700">
                <svg:rect height=70000 width=70000 fill="url(#floor_2)" stroke="white">



tag Shot < svg:g
    prop rotation
    attr transform

    def render
        <self transform="translate(30, -25)">
            <svg:defs>
                <svg:pattern #shot patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                    <svg:image href="textures/shoot/shoot/muzzle_flash_0.png" width="100" height="100">
            <svg:rect height=100 width=100 fill="url(#shot)">



tag App
    attr height
    attr width
    prop pos default: {x: 0,  y: 0}
    prop keys default: {}
    prop player-rotation default: 0
    prop shoot

    def mount
        schedule interval: 1
        document.addEventListener 'keydown', do |e|
            keydown e
            render
        document.addEventListener 'keyup', do |e|
            keyup e
            render
        render

    def aim e
        console.log e.event
        player-rotation = Math.atan2(e.event:x - 500, e.event:y - 350)/3.1415*180.0 - 90;

    def keydown e
        keys[e:code] = true

    def keyup e
        keys[e:code] = false

    def giveAShoot e
        shoot = true
        Imba.setTimeout 100, do
            shoot = false


    def tick
        if keys:KeyA
            pos:x -= 1
        if keys:KeyD
            pos:x += 1
        if keys:KeyS
            pos:y -= 1
        if keys:KeyW
            pos:y += 1
        render

    def render
        <self :mousedown.giveAShoot :mousemove.aim style="height: 700px; width: 1000px; background-color: black">
            <svg:svg height="700px" width="1000px" transform="scale(1,-1)">
                <Ground pos=pos>
                <Player pos=pos rotation=player-rotation shoot=shoot>

Imba.mount <App>

