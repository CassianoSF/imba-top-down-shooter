tag App
    attr height
    attr width
    prop pos default: {x: 0,  y: 0}
    prop keys default: {}
    prop player-rotation default: 0

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
        <self :mousemove.aim style="height: 700px; width=1000px; background-color: black">
            <svg:svg height="700px" width="1000px" transform="scale(1,-1)">
                <svg:g transform="translate({pos:x}, {pos:y}) rotate({player-rotation})"  stroke="black">
                    <svg:g transform="translate({-50}, {-50})">
                        <svg:defs>
                            <svg:pattern #img1 patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                                <svg:image href="textures/handgun/idle/survivor-idle_handgun_9.png" x=0 y=0 width="100" height="100">
                        <svg:rect height=100 width=100 fill="url(#img1)" stroke="black">

Imba.mount <App>
