export class Animation
    prop path
    prop size
    prop time default: 0
    prop frame-length
    prop ajust

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1
