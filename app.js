import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

class GeometryAnimation {
  constructor() {
    this.canvas = document.getElementById('geometry');
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });

    this.init();
    this.animate();
    this.setupResize();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.z = 5;

    // Create simpler circular geometry with fewer segments
    const geometry = new THREE.TorusKnotGeometry(3, 1, 16, 3); 
    const material = new THREE.MeshBasicMaterial({
      color: 0xff1493,
      wireframe: true,
      wireframeLinewidth: 100, 
    });

    // Create custom geometry for thick lines
    const lineGeometry = new THREE.BufferGeometry();
    const positions = [];
    const edges = new THREE.EdgesGeometry(geometry);
    const edgePositions = edges.attributes.position.array;

    // Create tube-like thick lines by expanding each line segment
    for (let i = 0; i < edgePositions.length; i += 6) {
      const x1 = edgePositions[i];
      const y1 = edgePositions[i + 1];
      const z1 = edgePositions[i + 2];
      const x2 = edgePositions[i + 3];
      const y2 = edgePositions[i + 4];
      const z2 = edgePositions[i + 5];

      const thickness = 0.15; 

      // Create tube vertices
      positions.push(
        x1 - thickness, y1 - thickness, z1,
        x1 + thickness, y1 + thickness, z1,
        x2 + thickness, y2 + thickness, z2,
        
        x1 - thickness, y1 - thickness, z1,
        x2 + thickness, y2 + thickness, z2,
        x2 - thickness, y2 - thickness, z2
      );
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const lineMaterial = new THREE.MeshBasicMaterial({
      color: 0xff1493,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });

    this.mesh = new THREE.Mesh(lineGeometry, lineMaterial);
    this.scene.add(this.mesh);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff1493, 1);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.mesh.rotation.x += 0.001;
    this.mesh.rotation.y += 0.002;

    // Simplified wave effect for fewer vertices
    const time = Date.now() * 0.001;
    const positions = this.mesh.geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positions, i);
      
      const wave = Math.sin(vertex.x + time) * 0.1;
      vertex.z += wave;
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positions.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }

  setupResize() {
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }
}

// Initialize text animations with GSAP
const initTextAnimations = () => {
  gsap.from('.hero-content', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: 'power4.out'
  });
  
  // Rotate sigil slowly
  gsap.to('.mystical-sigil', {
    rotation: 360,
    duration: 60,
    repeat: -1,
    ease: 'none'
  });

  gsap.from('.framework-item', {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.framework-grid',
      start: 'top center+=100',
      end: 'bottom center',
      toggleActions: 'play none none reverse'
    }
  });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GeometryAnimation();
  initTextAnimations();
});