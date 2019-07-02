export class Gun
    prop ammo
    prop cap
    prop rate
    prop damage
    prop reload-time
    prop name
    prop power
    prop accuracy
    prop shoot-sounds

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1
