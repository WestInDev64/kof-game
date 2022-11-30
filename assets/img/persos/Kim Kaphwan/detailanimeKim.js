export default {
    nbFrames: 175,
    animations: [
        {
            name: "idle",
            start: 0,
            end: 3
        },
        {
            name: "walkFwd",
            start: 4,
            end: 8
        },
        {
            name: "walkBwd",
            start: 9,
            end: 15
        },
        {
            name: "jump",
            start: 24,
            end: 28,
        },
        {
            name: "crouch",
            start: 28,
            end: 29,
        },
        {
            name: "kick",
            start: 107, //100
            end: 114,  //109
        },
        {
            name: "dammaged",
            start: 114,
            end: 116, //need to check it again
        },
        {
            name: "ko",
            start: 131,
            end: 139,
        }
    ]
};