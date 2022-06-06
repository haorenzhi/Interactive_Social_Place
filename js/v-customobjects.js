const fakeBodyCount = 1;
const fakeBodySteps = 1;

const trackedKeys = [
  "size",
  "color",
  "fireStrength",
  "rotation",
  "position",
  "paritype",
  "displayName",
  "label",
  "labelWidth",
];

// Decorate the head of our guests
Vue.component("obj-head", {
  template: `<a-entity>

		<a-cylinder 
			shadow
			:radius="0.05"
      :height="0.5"
			:color="obj.color.toHex()" 
      position="0 -1 0"
				
			>
			<obj-axes scale=".1 .1 .1" v-if="false" />
		</a-cylinder>

		<a-cone v-for="(spike,index) in spikes"
			:key="index"
			:height="spike.size*0.2"
			:radius-bottom="headSize*.5"
			:position="spike.position.toAFrame(0, .2, 0)"
			:rotation="spike.rotation.toAFrame()"
			:color="obj.color.toHex(.5*Math.sin(index))" 
      position="0 -0.7 0"
			
			>
		
		</a-cone>

		<!-- wings -->
		<a-sphere
		
			:radius="headSize*.2"
			position="-0.2 -0.9 0"
			:color="obj.color.toHex(.6)" 		
		>
	
		</a-sphere>
    
    <a-sphere
			:radius="headSize*.2"
			position="0.2 -0.9 0"
			:color="obj.color.toHex(.6)" 		
		>
	
		</a-sphere>
	</a-entity>
	`,
  computed: {
    color() {
      return this.obj.color.toHex ? this.obj.color.toHex() : this.obj.color;
    },
    headSize() {
      return this.obj.size instanceof Vector ? this.obj.size.x : this.obj.size;
    },
  },

  data() {
    let spikeCount = Math.random() + 4;
    let spikes = [];
    let h2 = Math.random() - 0.2;

    for (var i = 0; i < spikeCount; i++) {
      let h = 0.1;
      let spike = new LiveObject(undefined, {
        size: Math.random() * 0.4 + 0.2,
        color: new Vector(noise(i) * 30 + 140, 0, 40 + 20 * noise(i * 3)),
      });
      let r = 0.2;
      // Put them on the other side
      let theta = 4 * noise(i * 10) + 3;
      spike.position.setToCylindrical(r, theta, h * 0.3);
      // Look randomly
      spike.lookAt(0, h2, 0);
      spike.rotateX(-Math.PI / 2);
      spikes.push(spike);
    }

    return {
      spikes: spikes,
    };
  },

  mounted() {
    // console.log(this.headSize)
  },
  props: ["obj"],
});

Vue.component("obj-fire", {
  template: `
	<a-entity>
		<obj-axes scale="5 5 5" v-if="false" />
		<a-sphere 
			color="grey"
			radius=2 
			scale="1 .3 1" 
			roughness=1
			segments-height="5"
			segments-width="10"
			theta-start=0
			theta-length=60
			position="0 -.4 0"
			>
		</a-sphere>
		<a-cone
			position="0 .2 0"
			@click="click"
			:animation="heightAnimation"
			:color="obj.color.toHex()"
			height=.2
			radius-bottom=".2"

			:scale="(obj.fireStrength*.2 + 1) + ' ' + .1*obj.fireStrength + ' ' + (obj.fireStrength*.2 + 1)"
			:material="fireMaterial">

		</a-cone>

		<a-light
			:animation="intensityAnimation"

			position="0 1 0"
			intensity="2"
			:color="obj.color.toHex()"
			type="point"
			:distance="obj.fireStrength*4 + 10"
			decay="2">
		</a-light>
	</a-entity>

	`,

  // Values computed on the fly
  computed: {
    fireMaterial() {
      return `emissive:${this.obj.color.toHex(0.2)}`;
    },

    animationSpeed() {
      return 500;
    },
    intensityAnimation() {
      return `property: intensity; from:.3; to:.6; dir:alternate;dur: ${this.animationSpeed}; easing:easeInOutQuad;loop:true`;
    },
    heightAnimation() {
      return `property: height; from:${this.obj.fireStrength};to:${
        this.obj.fireStrength * 2
      }; dir:alternate;dur: 500; easing:easeInOutQuad;loop:true`;
    },
  },

  methods: {
    click() {
      this.obj.fireStrength += 1;
      this.obj.fireStrength = (this.obj.fireStrength % 10) + 1;

      // Tell the server about this action
      this.obj.post();
    },
  },

  // this function runs once when this object is created
  mounted() {},

  props: ["obj"],
});

Vue.component("obj-pot", {
  template: `
    <a-entity
            gltf-model="models/pot/scene.gltf"
            position="0 0 0"
            :scale="(obj.fireStrength*.3 + .5) + ' ' + (obj.fireStrength*.3 + .5) + ' ' + (obj.fireStrength*.3 + .5)"
            @click="click"
            :animation="heightAnimation"
            >
            <obj-axes scale="5 5 5" v-if="false" />
		<a-light
			:animation="intensityAnimation"

			position="0 0 0"
			intensity="2"
			:color="obj.color.toHex()"
			type="point"
			:distance="obj.fireStrength*4 + 10"
			decay="2">
		</a-light>
	</a-entity>

	`,

  // Values computed on the fly
  computed: {
    animationSpeed() {
      return 500;
    },
    intensityAnimation() {
      return `property: intensity; from:.3; to:.6; dir:alternate;dur: ${this.animationSpeed}; easing:easeInOutQuad;loop:true`;
    },
    heightAnimation() {
      return `property: height; from:${this.obj.fireStrength};to:${
        this.obj.fireStrength * 5
      }; dir:alternate;dur: 500; easing:easeInOutQuad;loop:true`;
    },
  },

  methods: {
    click() {
      this.obj.fireStrength += 1;
      this.obj.fireStrength = (this.obj.fireStrength % 10) + 1;

      // Tell the server about this action
      this.obj.post();
    },
  },

  // this function runs once when this object is created
  mounted() {},

  props: ["obj"],
});

Vue.component("obj-world", {
  template: `
	<a-entity>
  
		<!--------- SKYBOX --------->

		<a-sky src="#sky-night"></a-sky>

		<a-plane 
			roughness="1"
			shadow 
			color="#648b55"
			height="100" 
			width="100" 
			rotation="-90 0 0">
		</a-plane>

		<a-entity 
			gltf-model="url(models/moon/scene.gltf)" 
			scale =".08 .08 .08" 
			rotation="0 0 0" 
			position = "-45 50 -80"
			animation="property: rotation; to: 0 360 0; loop: true; dur: 10000">
    	</a-entity>
    
    

		<!---- lights ----> 
		<a-entity light="type: ambient; intensity: 0.4;" color="white"></a-entity>
		<a-light type="directional" 
			position="0 10 0" 
			rotation="-90 0 0" 
			intensity="0.6"
      color="hsl(191, 100%, 88%)"
			castShadow target="#directionaltarget">
			<a-entity id="directionaltarget" position="0 10 -20"></a-entity>
		</a-light>
    
    <a-light type="directional" 
			position="10 10 0" 
			rotation="0 0 0" 
			intensity="0.7"

			castShadow target="#directionaltarget">
			<a-entity id="directionaltarget" position="-10 0 -20"></a-entity>
		</a-light>

		



		<a-entity gltf-model="url(models/tree/scene.gltf)"
			v-for="(tree,index) in trees"
			scale=".005 .005 .005"
			:key="'tree' + index"
			shadow 

			:rotation="tree.rotation.toAFrame()"
			:position="tree.position.toAFrame()">
			
			
		</a-entity>

		

		<a-box 
			v-for="(rock,index) in rocks"
			:key="'rock' + index"
			shadow 

			roughness="1"

			:color="rock.color.toHex()"
			:width="rock.size.x*0.5" 
			:depth="rock.size.z*0.5" 
			:height="rock.size.y*0.5" 
			
			:rotation="rock.rotation.toAFrame()"
			:position="rock.position.toAFrame()">
		</a-box>

	</a-entity>
		`,

  data() {
    // Where we setup the data that this *rendered scene needs*

    // EXAMPLE: Generated landscape
    // Make some random trees and rocks
    // Create a lot of LiveObjects (just as a way
    //  to store size and color conveniently)
    // Interpret them as whatever A-Frame geometry you want!
    // Cones, spheres, entities with multiple ...things?
    // If you only use "noise" and not "random",
    // everyone will have the same view. (Wordle-style!)
    let trees = [];
    let count = 10;
    for (var i = 0; i < count; i++) {
      let h = 6 + 4 * noise(i); // Size from 1 to 3
      let tree = new LiveObject(undefined, {
        size: new THREE.Vector3(0.3, h, 0.3),
        color: new Vector(
          noise(i * 50) * 30 + 160,
          100,
          40 + 10 * noise(i * 10)
        ),
      });
      let r = 20 + 10 * noise(i * 40);
      let theta = 2 * noise(i * 10);
      tree.position.setToCylindrical(r, theta, h / 50);
      tree.lookAt(0, 1, 0);
      trees.push(tree);
    }

    let rocks = [];
    let rockCount = 50;
    for (var i = 0; i < rockCount; i++) {
      let h = 1.2 + noise(i * 100); // Size from 1 to 3
      let rock = new LiveObject(undefined, {
        size: new THREE.Vector3(h, h, h),
        color: new Vector(noise(i) * 30 + 140, 0, 40 + 20 * noise(i * 3)),
      });
      let r = 4 + 1 * noise(i * 1);
      // Put them on the other side
      let theta = 2 * noise(i * 10) + 3;
      rock.position.setToCylindrical(r, theta, h * 0.3);
      // Look randomly
      rock.lookAt(
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100
      );
      rocks.push(rock);
    }

    return {
      trees: trees,
      rocks: rocks,
    };
  },

  mounted() {
    // Create a fire object
    // Attach this liveobject to the ROOM
    // and then the room deals with drawing it to AFRAME
    let fire = new LiveObject(this.room, {
      paritype: "fire", // Tells it which type to use
      uid: "fire0",
      isTracked: true,
      onUpdate({ t, dt, frameCount }) {
        // Change the fire's color
        let hue = (noise(t * 0.02) + 1) * 180;
        Vue.set(this.color.v, 0, hue);
      },
    });

    fire.position.set(0, 0, 0);
    fire.fireStrength = 1;

    let fire2 = new LiveObject(this.room, {
      paritype: "fire", // Tells it which type to use
      uid: "fire2",
      onUpdate({ t, dt, frameCount }) {
        let hue = (noise(t * 0.02) + 1) * 180;
        Vue.set(this.color.v, 0, hue);

        // console.log(this.color[0] )
      },
    });

    fire2.position.set(3, 0, -4);
    fire2.fireStrength = 1;

    let pot = new LiveObject(this.room, {
      paritype: "pot", // Tells it which type to use
      uid: "pot0",
      onUpdate({ t, dt, frameCount }) {
        let hue = (noise(t * 0.02) + 1) * 180;
        Vue.set(this.color.v, 0, hue);

        // console.log(this.color[0] )
      },
    });

    pot.position.set(3.8, 0.2, -3.6);
    pot.fireStrength = 2;

    let grammar = new tracery.createGrammar(
      {
        songStyle: ", played as #song.a#, on #musicModifier# #instrument#",
        instrument: [
          "ukulele",
          "vocals",
          "guitar",
          "clarinet",
          "piano",
          "harmonica",
          "sitar",
          "tabla",
          "harp",
          "dulcimer",
          "violin",
          "accordion",
          "concertina",
          "fiddle",
          "tamborine",
          "bagpipe",
          "harpsichord",
          "euphonium",
        ],
        musicModifier: [
          "heavy",
          "soft",
          "acoustic",
          "psychedelic",
          "light",
          "orchestral",
          "operatic",
          "distorted",
          "echoing",
          "melodic",
          "atonal",
          "arhythmic",
          "rhythmic",
          "electronic",
        ],
        musicGenre: [
          "metal",
          "electofunk",
          "jazz",
          "salsa",
          "klezmer",
          "zydeco",
          "blues",
          "mariachi",
          "flamenco",
          "pop",
          "rap",
          "soul",
          "gospel",
          "buegrass",
          "swing",
          "folk",
        ],
        musicPlays: ["echoes out", "reverberates", "rises", "plays"],
        musicAdv: [
          "too quietly to hear",
          "into dissonance",
          "into a minor chord",
          "changing tempo",
          "to a major chord",
          "staccatto",
          "into harmony",
          "without warning",
          "briskly",
          "under the melody",
          "gently",
          "becoming #musicGenre#",
        ],
        song: [
          "melody",
          "dirge",
          "ballad",
          "poem",
          "beat poetry",
          "slam poetry",
          "spoken word performance",
          "hymn",
          "song",
          "tone poem",
          "symphony",
        ],
        musicAdj: [
          "yielding",
          "firm",
          "joyful",
          "catchy",
          "folksy",
          "harsh",
          "strong",
          "soaring",
          "rising",
          "falling",
          "fading",
          "frantic",
          "calm",
          "childlike",
          "rough",
          "sensual",
          "erotic",
          "frightened",
          "sorrowful",
          "gruff",
          "smooth",
        ],
      },
      {}
    );
    grammar.addModifiers(baseEngModifiers);

    const campfireSongs = [
      "Lonely Goatherd",
      "On top of spaghetti",
      "Princess Pat",
      "BINGO",
      "Old Mac Donald",
      "Going on a Bear Hunt",
      "The Green Grass Grew All Around",
      "Home on the Range",
      "John Jacob Jingleheimer Schmitt",
      "The Wheels on the Bus",
      "If I had a Hammer",
    ];
    this.room.detailText = "Campfire time!";

    this.room.time.onSecondChange((second) => {
      // Change the song every minute (60 seconds)
      let rate = 10; // How many seconds between changes
      if (second % rate === 0) {
        let tick = second / rate;
        let index = second % campfireSongs.length;
        let song = campfireSongs[index];
        this.room.detailText = song + grammar.flatten("#songStyle#");
      }
    });
  },

  props: ["room"],
});
