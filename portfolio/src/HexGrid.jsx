import React, { useEffect, useRef } from 'react';

const Config = {
  HexRadius: 5,
  VirtualHeight: 3000,
  ColorBG: '#000000',
  ColorStroke: '#0f0f0f',
  FillSpeed: 0.01,
  DrainSpeed: 0.01,
  MaxBranch: 3,
  DecayRate: 0.5
};

const State = {
  Dormant: 0,
  Filling: 1,
  Active: 2,
  Drainign: 3
};

const axialToPixel = (q, r, radius) => {
  const x = radius * (1.5 * q);
  const y = radius * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
  return { x, y };
};

const pixelToAxial = (x, y, radius) => {
  const q = ((2 / 3) * x) / radius;
  const r = ((-1 / 3) * x + (Math.sqrt(3) / 3) * y) / radius;
  
  let rq = Math.round(q);
  let rr = Math.round(r);
  let rs = Math.round(-q - r);
  const qDiff = Math.abs(rq - q);
  const rDiff = Math.abs(rr - r);
  const sDiff = Math.abs(rs - (-q - r));
  if (qDiff > rDiff && qDiff > sDiff) rq = -rr - rs;
  else if (rDiff > sDiff) rr = -rq - rs;
  
  return { q: rq, r: rr };
};

const neighbouringHexagons = (q,r,HexMap) => {
  return [HexMap.get(`${q+1},${r}`),HexMap.get(`${q-1},${r}`),HexMap.get(`${q},${r+1}`),HexMap.get(`${q},${r-1}`),HexMap.get(`${q+1},${r-1}`),HexMap.get(`${q-1},${r+1}`)]
};

export default function App()
{
  const canvasRef = useRef(null);
  const scrollRef = useRef(0);

  useEffect(() => {
	const canvas = canvasRef.current;
	const ctx = canvas.getContext('2d', { alpha: false });
	let animationFrameId;
	let HexMap = new Map();

	const hexCorners = [];
	for (let i = 0; i < 6; i++)
	  {
	  const angle = (Math.PI / 3) * i;
	  hexCorners.push({
		x: Config.HexRadius * Math.cos(angle),
		y: Config.HexRadius * Math.sin(angle)
	  });
	}

	const resizeAndBuild = () => {
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	  
	  HexMap.clear();
	  const QMax = Math.ceil(canvas.width/(Config.HexRadius*1.5))+1;
	  for (let q = -1; q <= QMax; q++)
	  {
		const ROffset = Math.floor(q/2);
		const RMax = Math.ceil(Config.VirtualHeight/(Config.HexRadius*Math.sqrt(3))) + 1;

		for (let r = -ROffset-1; r <= RMax - ROffset; r++)
		{
		  const {x,y} = axialToPixel(q,r,Config.HexRadius);

		  if (x >= -Config.HexRadius && x <= canvas.width + Config.HexRadius && y >= -Config.HexRadius && y <= Config.VirtualHeight + Config.HexRadius)
		  {
			HexMap.set(`${q},${r}`, {
			  q: q,
			  r: r,
			  x: x,
			  y: y,
			  state: State.Dormant,
			  energy: 0
			});
		  }
		}
	  }
	};

	const handleMouseMove = (e) => {
	  const rect = canvas.getBoundingClientRect();
	  const x = e.clientX - rect.left;
	  const y = e.clientY - rect.top + scrollRef.current;
	  const {q: HexQ,r: HexR} = pixelToAxial(x,y,Config.HexRadius);
	  const TargetHex = HexMap.get(`${HexQ},${HexR}`);
	  if (TargetHex && TargetHex.state === State.Dormant)
	  {
		TargetHex.state = State.Filling;
	  }
	};

	const handleScroll = () => {
	scrollRef.current = window.scrollY;
	};

	window.addEventListener('mousemove', handleMouseMove);
	window.addEventListener('scroll', handleScroll);

	const engineLoop = () => {
	  const currentScroll = scrollRef.current;

	  ctx.fillStyle = Config.ColorBG;
	  ctx.fillRect(0, 0, canvas.width, canvas.height);

	  ctx.save();
	  ctx.translate(0, -currentScroll);

	  ctx.lineWidth = 1;
	  ctx.strokeStyle = Config.ColorStroke;

	  const TriggerQueue = [];

	  for (let [key, hex] of HexMap) {
		if (hex.y < currentScroll - Config.HexRadius * 2 || hex.y > currentScroll + canvas.height + Config.HexRadius*2)
		{
		  continue;
		}

		if (hex.state === State.Filling)
		{
		  hex.energy += Config.FillSpeed;
		  if (hex.energy >= 0.3)
		  {
			hex.energy = 0.3;
			hex.state = State.Active;
		  }
		}
		else if (hex.state === State.Drainign)
		{
		  hex.energy -= Config.DrainSpeed;
		  if (hex.energy <= 0.0)
		  {
			hex.energy = 0.0;
			hex.state = State.Dormant;
		  }
		}
		else if (hex.state === State.Active)
		{
		  const HexNeighbours = neighbouringHexagons(hex.q,hex.r,HexMap);
		  const EdgeTile = HexNeighbours.some(n => n === undefined); //Checks if a neighbour is undefined
		  const WillDecay = Math.random() < Config.DecayRate;
		  if (EdgeTile || WillDecay)
		  {
			hex.state = State.Drainign;
			continue;
		  }
		  let ValidNeighbours = HexNeighbours.filter(n => n && n.state === State.Dormant);
		  ValidNeighbours.sort(() => Math.random() - 0.5);
		  const BranchingFactor = Math.ceil(Math.random() * (Config.MaxBranch))
		  const Branches = ValidNeighbours.slice(0,BranchingFactor);
		  for (let neighbour of Branches)
		  {
			TriggerQueue.push(neighbour);
		  }
		  hex.state = State.Drainign;
		}

		ctx.save();
		ctx.translate(hex.x, hex.y);
		
		ctx.beginPath();
		ctx.moveTo(hexCorners[0].x, hexCorners[0].y);
		for (let i = 1; i < 6; i++) {
		  ctx.lineTo(hexCorners[i].x, hexCorners[i].y);
		}
		ctx.closePath();
		ctx.stroke();

		// TODO: If the hex has energy > 0, fill it with your muted turquoise color here
		if (hex.energy > 0)
		{
		  ctx.fillStyle = `rgba(0,123,255,${hex.energy})`;
		  ctx.fill();
		}
		
		ctx.restore();
	  }

	  for (let target of TriggerQueue)
	  {
		if (target.state === State.Dormant)
		{
			target.state = State.Filling;
		}
	  }

	  ctx.restore();
	  animationFrameId = requestAnimationFrame(engineLoop);
	};

	resizeAndBuild();
	window.addEventListener('resize', resizeAndBuild);
	engineLoop();

	return () => {
	  window.removeEventListener('resize', resizeAndBuild);
	  window.removeEventListener('mousemove', handleMouseMove);
	  window.removeEventListener('scroll', handleScroll);
	  cancelAnimationFrame(animationFrameId);
	};
  }, []);

  return (
	<div style={{ position: 'relative', minHeight: `${Config.VirtualHeight}px`, color: '#F0F8FF', fontFamily: 'Lato' }}>
	  <canvas 
		ref={canvasRef} 
		style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, pointerEvents: 'none' }} 
	  />
	</div>
  );
}