export class Crosshair
    prop x
    prop y

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1