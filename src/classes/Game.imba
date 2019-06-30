export class Game
    prop keys
    prop time
    prop height
    prop width

    def initialize 
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1