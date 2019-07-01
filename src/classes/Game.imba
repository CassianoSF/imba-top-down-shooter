export class Game
    prop keys
    prop time
    prop height
    prop width
    prop barrels
    prop boxes

    def initialize 
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1