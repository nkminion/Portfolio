import React, { useEffect, useRef } from 'react';
import { Config, State } from './data.js';

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

export default function HexGrid()
{
  const canvasRef = useRef(null);
  const scrollRef = useRef(0);

  useEffect(() => {
	const canvas = canvasRef.current;
	const ctx = canvas.getContext('2d', { alpha: false });

	const bgCanvas = document.createElement('canvas');
	const bgCtx = bgCanvas.getContext('2d', {alpha: false});

	let animationFrameId;
	let HexMap = new Map();

	let ActiveHexagons = new Set();
	let currentWidth = window.innerWidth;

	const hexCorners = [];
	for (let i = 0; i < 6; i++)
	  {
	  const angle = (Math.PI / 3) * i;
	  hexCorners.push({
		x: Config.HexRadius * Math.cos(angle),
		y: Config.HexRadius * Math.sin(angle)
	  });
	}

	const resizeAndBuild = (e) => {
	  if (e && window.innerWidth === currentWidth) return;
	  currentWidth = window.innerWidth;

	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;

	  bgCanvas.width = canvas.width;
	  bgCanvas.height = 

	  HexMap.clear();
	  ActiveHexagons.clear();

	  const QMax = Math.ceil(canvas.width/(Config.HexRadius*1.5))+1;
	  const RMax = Math.ceil(Config.VirtualHeight/(Config.HexRadius*Math.sqrt(3))) + 1;

	  for (let q = -1; q <= QMax; q++)
	  {
		const ROffset = Math.floor(q/2);
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
		ActiveHexagons.add(`${HexQ},${HexR}`);
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

	  const viewMinY = currentScroll-(Config.HexRadius*2);
	  const viewMaxY = currentScroll+canvas.height+(Config.HexRadius*2);
	  const QMax = Math.ceil(canvas.width / (Config.HexRadius * 1.5)) + 1;

      ctx.lineWidth = 1;
      ctx.strokeStyle = Config.ColorStroke;
      ctx.beginPath();

	  for (let q = -1; q <= QMax; q++)
	  {
        const rMin = Math.floor((viewMinY / Config.HexRadius - (Math.sqrt(3)/2)*q) / Math.sqrt(3)) - 1;
        const rMax = Math.ceil((viewMaxY / Config.HexRadius - (Math.sqrt(3)/2)*q) / Math.sqrt(3)) + 1;

        for (let r = rMin; r <= rMax; r++)
		{
          const hex = HexMap.get(`${q},${r}`);
          if (hex)
		  {
            ctx.moveTo(hex.x + hexCorners[0].x, hex.y + hexCorners[0].y);
            for (let i = 1; i < 6; i++)
			{
              ctx.lineTo(hex.x + hexCorners[i].x, hex.y + hexCorners[i].y);
            }
            ctx.lineTo(hex.x + hexCorners[0].x, hex.y + hexCorners[0].y);
          }
        }
      }

	  ctx.stroke();

	  const TriggerQueue = [];

	  for (let key of ActiveHexagons)
	  {
		const hex = HexMap.get(key);
		if (!hex) continue;

		if (hex.state === State.Filling)
		{
		  hex.energy += Config.FillSpeed;
		  if (hex.energy >= 0.3)
		  {
			hex.energy = 0.3;
			hex.state = State.Active;
		  }
		}
		else if (hex.state === State.Draining)
		{
		  hex.energy -= Config.DrainSpeed;
		  if (hex.energy <= 0.0)
		  {
			hex.energy = 0.0;
			hex.state = State.Dormant;
			ActiveHexagons.delete(key);
			continue;
		  }
		}
		else if (hex.state === State.Active)
		{
		  const HexNeighbours = neighbouringHexagons(hex.q,hex.r,HexMap);
		  const EdgeTile = HexNeighbours.some(n => n === undefined); //Checks if a neighbour is undefined
		  const WillDecay = Math.random() < Config.DecayRate;
		  if (EdgeTile || WillDecay)
		  {
			hex.state = State.Draining;
		  }
		  else
		  {
			let ValidNeighbours = HexNeighbours.filter(n => n && n.state === State.Dormant);
			ValidNeighbours.sort(() => Math.random() - 0.5);
			const BranchingFactor = Math.ceil(Math.random() * (Config.MaxBranch))
			const Branches = ValidNeighbours.slice(0,BranchingFactor);
			for (let neighbour of Branches)
			{
				TriggerQueue.push(neighbour);
			}
			hex.state = State.Draining;
		  }
		}

		if (hex.energy > 0 && hex.y >= viewMinY && hex.y <= viewMaxY)
		{
			ctx.save();
			ctx.translate(hex.x, hex.y);
			
			ctx.beginPath();
			ctx.moveTo(hexCorners[0].x, hexCorners[0].y);
			for (let i = 1; i < 6; i++)
			{
			  ctx.lineTo(hexCorners[i].x, hexCorners[i].y);
			}
			ctx.closePath();
			
			ctx.fillStyle = `rgba(0,123,255,${hex.energy})`;
			ctx.fill();
			
			ctx.restore();
		}
	  }

	  for (let target of TriggerQueue)
	  {
		if (target.state === State.Dormant)
		{
			target.state = State.Filling;
			ActiveHexagons.add(`${target.q},${target.r}`);
		}
	  }

	  ctx.restore();
	  animationFrameId = requestAnimationFrame(engineLoop);
	};

	resizeAndBuild();
	engineLoop();

	return () => {
	  window.removeEventListener('resize', resizeAndBuild);
	  window.removeEventListener('mousemove', handleMouseMove);
	  window.removeEventListener('scroll', handleScroll);
	  cancelAnimationFrame(animationFrameId);
	};
  }, []);

  return (
	<canvas 
		ref={canvasRef} 
		style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, pointerEvents: 'none', height: '100%' }} 
	/>
  );
}