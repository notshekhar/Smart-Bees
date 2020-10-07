// const [normalize_x, normalize_y] = [
//     (val) => {
//         return map(val, 0, canvasWidth, 0, 1)
//     },
//     (val) => {
//         return map(val, 0, canvasHeight, 0, 1)
//     },
// ]
function Ziggurat() {
    var jsr = 123456789

    var wn = Array(128)
    var fn = Array(128)
    var kn = Array(128)

    function RNOR() {
        var hz = SHR3()
        var iz = hz & 127
        return Math.abs(hz) < kn[iz] ? hz * wn[iz] : nfix(hz, iz)
    }

    this.nextGaussian = function () {
        return RNOR()
    }

    function nfix(hz, iz) {
        var r = 3.442619855899
        var r1 = 1.0 / r
        var x
        var y
        while (true) {
            x = hz * wn[iz]
            if (iz == 0) {
                x = -Math.log(UNI()) * r1
                y = -Math.log(UNI())
                while (y + y < x * x) {
                    x = -Math.log(UNI()) * r1
                    y = -Math.log(UNI())
                }
                return hz > 0 ? r + x : -r - x
            }

            if (
                fn[iz] + UNI() * (fn[iz - 1] - fn[iz]) <
                Math.exp(-0.5 * x * x)
            ) {
                return x
            }
            hz = SHR3()
            iz = hz & 127

            if (Math.abs(hz) < kn[iz]) {
                return hz * wn[iz]
            }
        }
    }

    function SHR3() {
        var jz = jsr
        var jzr = jsr
        jzr ^= jzr << 13
        jzr ^= jzr >>> 17
        jzr ^= jzr << 5
        jsr = jzr
        return (jz + jzr) | 0
    }

    function UNI() {
        return 0.5 * (1 + SHR3() / -Math.pow(2, 31))
    }

    function zigset() {
        // seed generator based on current time
        jsr ^= new Date().getTime()

        var m1 = 2147483648.0
        var dn = 3.442619855899
        var tn = dn
        var vn = 9.91256303526217e-3

        var q = vn / Math.exp(-0.5 * dn * dn)
        kn[0] = Math.floor((dn / q) * m1)
        kn[1] = 0

        wn[0] = q / m1
        wn[127] = dn / m1

        fn[0] = 1.0
        fn[127] = Math.exp(-0.5 * dn * dn)

        for (var i = 126; i >= 1; i--) {
            dn = Math.sqrt(-2.0 * Math.log(vn / dn + Math.exp(-0.5 * dn * dn)))
            kn[i + 1] = Math.floor((dn / tn) * m1)
            tn = dn
            fn[i] = Math.exp(-0.5 * dn * dn)
            wn[i] = dn / m1
        }
    }
    zigset()
}
let z = new Ziggurat()

function mutate(x) {
    if (Math.random() < 0.1) {
        let offset = z.nextGaussian() * 0.4
        let newx = x + offset
        return newx
    } else {
        return x
    }
}

function Bee(pos, vel, target, o, brain) {
    this.pos = vector(pos.x, pos.y)
    this.vel = vector(vel.x, vel.y)
    this.target = target
    this.brain = brain ? brain.copy() : new NeuralNetwork(4, 21, 2)
    this.score = 0
    this.lifespan = 150
    this.obes = o ? o : []
    this.pd_acc = this.brain
        .predict([this.pos.x, this.pos.y, this.target.pos.x, this.target.pos.y])
        .map((e) => map(e, 0, 1, -1, 1))
    this.acc = vector(this.pd_acc[0], this.pd_acc[1])
    this.copy = () => {
        return new Bee(pos, vel, target, brain)
    }
    this.mutate = () => {
        this.brain.mutate(mutate)
    }
    this.updateAcc = (arr) => {
        this.acc = vector(arr[0], arr[1])
    }
    this.show = () => {
        ctx.beginPath()
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.arc(this.pos.x, this.pos.y, 2, 0, 2 * Math.PI)
        ctx.fill()
    }
    this.update = () => {
        // console.log(this.pd_acc)
        if (!this.die()) {
            this.lifespan--
            this.vel = this.vel.add(this.acc).add(vector(0, 0.9))
            this.pos = this.pos.add(this.vel)
            this.updateScore()
            this.updateAcc(
                this.brain
                    .predict([
                        this.pos.x,
                        this.pos.y,
                        this.target.pos.x,
                        this.target.pos.y,
                    ])
                    .map((e) => map(e, 0, 1, -1, 1))
            )
        } else {
            diedBees.unshift(this)
            bees = bees.filter((x) => x != this)
            length--
        }
    }
    this.updateScore = () => {
        let distance = this.target.pos.distance(this.pos)
        this.score = 1 / distance
    }
    this.die = () => {
        for(let ob of this.obes){
            //do something
        }
        if (
            this.lifespan <= 0 ||
            this.pos.x < 0 ||
            this.pos.x > canvasWidth ||
            this.pos.y < 0 ||
            this.pos.y > canvasHeight ||
            (this.pos.x < this.target.pos.x + 10) &
                (this.pos.x > this.target.pos.x - 10) &
                (this.pos.y < this.target.pos.y + 10) &
                (this.pos.y > this.target.pos.y - 10)
        )
            return true
        return false
    }
}

function Target(pos) {
    this.pos = vector(pos.x, pos.y)
    this.show = () => {
        ctx.beginPath()
        ctx.fillStyle = "rgb(233, 233, 233)"
        ctx.rect(this.pos.x - 10, this.pos.y - 10, 20, 20)
        ctx.fill()
    }
}


// {"pos":{"x":513.11252933985,"y":687.2000019444664,"z":0},"vel":{"x":4.733302087766216,"y":-0.6999994776509973,"z":0},"target":{"pos":{"x":793.9048622783766,"y":143.39903046575228,"z":0}},"brain":{"input_nodes":4,"hidden_nodes":21,"output_nodes":2,"weights_ih":{"rows":21,"cols":4,"data":[[-5.255550404598495,-1.7136706184973112,5.190975201617784,1.763268297771405],[4.117498048557151,2.7502527244979436,0.9978396018011819,2.8423085773410053],[2.0971073883970206,-2.643381314935979,-3.419576228456501,3.471207591540761],[4.272115813371472,-0.11693941124668253,-1.3296240316188659,1.651391843858422],[-0.5157029239486947,2.9313678226905404,1.9126211700255138,8.163567316439115],[-0.35038855493267174,4.560537432273121,-1.7895479372819756,4.365545038496672],[-3.2788664909574283,2.527776000642393,2.605540884507447,1.358845482590009],[3.5091101502759012,-2.2153185615412974,-0.12972365089546,0.23436616887476308],[1.7597857665509473,2.5386684921814826,2.0614914171507617,-6.3250298623386945],[3.2343623911144253,5.533087040163006,0.20525257428792337,-4.144048323944811],[3.1489916636361586,-1.1907569747668716,-8.356906929900706,-0.8890511440588817],[7.494102700351959,-2.1077083555530978,-0.31249081921998556,2.027401803632725],[3.5078293585675486,5.970923741793089,3.6926289676814266,-1.2788957988464884],[-1.2850422908384045,1.3711843836975341,0.8068679511290686,-0.9660024599017886],[-2.3209354269302875,2.18953428877132,-0.8717641795807329,3.696957464759173],[3.7987139743641696,1.0560431072951977,-2.847559903111488,3.201334861377479],[1.5957834580494334,2.4495603240542017,-0.9500282060978175,-4.2465802006602615],[-2.7964183072956397,-0.09933472138944094,-0.5422665284126126,-3.6043411448204443],[-0.29809546982813967,-2.0749354040289205,-1.5744401145215343,-2.117998624796397],[-0.5045492105068639,0.8967388346418426,2.9609648316475092,-0.500150312388656],[-0.6765129768347864,2.0428491569258806,2.9868798687778857,4.439874402037693]]},"weights_ho":{"rows":2,"cols":21,"data":[[7.397359175469251,-3.781259573006494,-2.5851802389069514,-1.8727779821249382,1.6246090857762658,-2.8161461063487367,-1.2201615781170712,-4.8447625550802345,3.0499770667131747,-0.5007663422645727,-5.129093857930731,4.024196194026297,2.590055261169338,4.2543342202885785,-0.902317517373181,-0.9522227142142159,-0.6348079502541084,3.357166345907048,0.6192723153357764,-0.3726600017012806,-2.374892813755774],[1.987763975533977,5.3801738668869215,-2.05348215092193,-4.0719940001039525,-6.012921512835103,2.2618585078091855,-6.448738784909426,4.402630107870161,3.269612927624326,-1.5134637905217445,2.7628397724087903,-8.502636287956891,2.657799684808209,-0.7902674034832534,-5.847890937923639,1.0045503705370322,-2.1214185318104186,5.347874222418001,-1.8849128733332208,-1.9514831825256151,2.4522738406773246]]},"bias_h":{"rows":21,"cols":1,"data":[[2.0947774194708653],[0.33779132265418454],[-6.261288503126344],[-1.4590997232657568],[3.345073312158705],[0.3405226575130611],[3.7259575044119266],[2.9851452277544483],[-3.4096775560694272],[-5.85286381360885],[3.908936205652693],[-6.148427183050505],[-0.039673628372983195],[0.9070319498539312],[1.5034766568813929],[1.5207014188929877],[0.8461854071180424],[1.9219754787622163],[-1.1354645358948405],[0.6655278258825119],[4.261140046924818]]},"bias_o":{"rows":2,"cols":1,"data":[[1.0671182559834054],[-3.1713803639967026]]},"learning_rate":0.1,"activation_function":{}},"score":0.0016339436728246557,"lifespan":143,"obes":[],"pd_acc":[-0.967916620168457,-0.9999999879540458],"acc":{"x":0.9533612035482641,"y":-0.9999999184773039,"z":0},"fitness":0.0392937815131766}