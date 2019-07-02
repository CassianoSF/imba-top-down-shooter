export class Game
    prop keys
    prop time
    prop height
    prop width
    prop barrels
    prop boxes
    prop theme-started
    prop player
    prop crosshair

    def startTheme
        return if theme-started
        theme-started = yes
        let theme0 = Audio.new('sounds/theme1.mp3')
        theme0:volume = 0.5
        let theme1 = Audio.new('sounds/theme0.mp3')
        theme1:volume = 0.5
        let theme2 = Audio.new('sounds/theme2.mp3')
        theme2:volume = 0.5
        let theme3 = Audio.new('sounds/theme3.mp3')
        theme3:volume = 0.5
        theme0:onended = (do theme1.play)
        theme1:onended = (do theme2.play)
        theme2:onended = (do theme3.play)
        theme3:onended = (do theme0.play)
        theme0.play

    def initListners
        document.addEventListener 'keydown', do |e|
            keydown e
            startTheme

        document.addEventListener 'keyup', do |e|
            keyup e

        document.addEventListener 'mousemove', do |e|
            aim e

        document.addEventListener 'mousedown' do |e|
            keys['leftbutton'] = yes if e:button == 0
            keys['rightbutton'] = yes if e:button == 2
            player.shoot  if e:button == 0
            player.attack if e:button == 2

        document.addEventListener 'mouseup' do |e|
            keys['rightbutton'] = no if e:button == 2
            keys['leftbutton'] = no if e:button == 0

        document.addEventListener 'contextmenu', do |e|
            e.preventDefault

    def aim e
        crosshair.x = e:x
        crosshair.y = -e:y
        player.rotation = ((Math.atan2(e:x - window:innerWidth/2, e:y - window:innerHeight/2)/3.1415*180.0 - 90) + 720) % 360 

    def keydown e
        player.changeGun :knife      if e:code == :Digit1 and player.invertory:knife
        player.changeGun :handgun    if e:code == :Digit2 and player.invertory:handgun
        player.changeGun :rifle      if e:code == :Digit3 and player.invertory:rifle
        player.changeGun :shotgun    if e:code == :Digit4 and player.invertory:shotgun
        player.changeGun :flashlight if e:code == :KeyF   and player.invertory:flashlight
        player.reload if e:code == :KeyR
        keys[e:code] = yes

    def keyup e
        keys[e:code] = no

    def initialize 
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1