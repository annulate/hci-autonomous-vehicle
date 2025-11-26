// This file contains the enhanced construction and accident scenes
// Copy the renderCenterLaneHazard sections to TrafficScene.tsx

const enhancedConstructionScene = `
if (scenario === 'construction') {
  return (
    <div
      className="absolute"
      style={{
        left: '50%',
        top: \`\${screenY}%\`,
        transform: 'translate(-50%, -50%)',
        width: \`\${dims.width * 3}px\`,
        zIndex: 1
      }}
    >
      {/* Construction Scene - More realistic */}
      <div className="relative flex flex-col items-center gap-1">
        {/* Warning text at very top */}
        <div 
          className="text-center text-orange-500 font-bold animate-pulse mb-1"
          style={{ 
            fontSize: \`\${10 * (dims.width / 75)}px\`,
            opacity: dims.opacity,
            textShadow: '0 0 10px rgba(249, 115, 22, 0.8), 0 0 20px rgba(249, 115, 22, 0.4)'
          }}
        >
          ⚠ CONSTRUCTION ZONE - TAKE CONTROL ⚠
        </div>

        {/* Warning Signs - Diamond shaped */}
        <div className="flex gap-3 mb-2" style={{ opacity: dims.opacity }}>
          {/* Road Work Sign */}
          <div className="relative">
            <div
              className="relative"
              style={{
                width: \`\${dims.width * 0.5}px\`,
                height: \`\${dims.width * 0.5}px\`,
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.7), inset 0 2px 6px rgba(255,255,255,0.4), inset 0 -2px 6px rgba(0,0,0,0.3)',
                border: '3px solid #dc2626'
              }}
            >
              {/* Worker icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="text-black font-extrabold"
                  style={{ 
                    fontSize: \`\${14 * (dims.width / 75)}px\`,
                    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))'
                  }}
                >
                  🚧
                </div>
              </div>
              {/* Reflective edges */}
              <div className="absolute inset-2 opacity-20 bg-white rounded-sm" style={{ clipPath: 'polygon(50% 5%, 95% 50%, 50% 95%, 5% 50%)' }} />
            </div>
          </div>

          {/* Speed Limit Sign */}
          <div
            className="bg-white rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{
              width: \`\${dims.width * 0.4}px\`,
              height: \`\${dims.width * 0.5}px\`,
              border: '4px solid #dc2626',
              boxShadow: '0 4px 12px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            {/* Metallic sheen */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-200 opacity-50" />
            <div className="text-center relative z-10">
              <div 
                className="text-black font-bold"
                style={{ fontSize: \`\${8 * (dims.width / 75)}px\` }}
              >
                SPEED
              </div>
              <div 
                className="text-black font-extrabold"
                style={{ fontSize: \`\${20 * (dims.width / 75)}px\` }}
              >
                25
              </div>
            </div>
          </div>
        </div>

        {/* Jersey Barriers - Realistic concrete barriers */}
        <div className="flex gap-1 mb-2" style={{ opacity: dims.opacity }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="relative"
              style={{
                width: \`\${dims.width * 0.45}px\`,
                height: \`\${dims.height * 0.3}px\`,
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
              }}
            >
              {/* Concrete texture */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, #d4d4d4 0%, #a3a3a3 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.5)'
                }}
              >
                {/* Orange stripe */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: '45%',
                    height: '10%',
                    background: '#f97316',
                    boxShadow: '0 0 8px rgba(249, 115, 22, 0.5)'
                  }}
                />
                {/* Concrete spots */}
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="absolute bg-gray-600/30 rounded-full"
                    style={{
                      width: \`\${2 + Math.random() * 4}px\`,
                      height: \`\${2 + Math.random() * 4}px\`,
                      left: \`\${20 + Math.random() * 60}%\`,
                      top: \`\${20 + Math.random() * 60}%\`
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Construction vehicles - Enhanced realism */}
        <div className="flex items-end justify-center gap-3 mb-2" style={{ opacity: dims.opacity }}>
          {/* Excavator - Highly detailed */}
          <div className="relative">
            {/* Boom arm */}
            <div
              className="absolute rounded-sm"
              style={{
                width: \`\${dims.width * 0.12}px\`,
                height: \`\${dims.height * 0.6}px\`,
                background: 'linear-gradient(to right, #ea580c 0%, #f59e0b 50%, #dc2626 100%)',
                transform: 'rotate(-40deg)',
                transformOrigin: 'bottom center',
                left: \`\${dims.width * 0.28}px\`,
                bottom: \`\${dims.height * 0.35}px\`,
                boxShadow: '0 3px 8px rgba(0,0,0,0.6), inset -2px 0 4px rgba(0,0,0,0.4), inset 2px 0 4px rgba(255,255,255,0.2)',
                border: '1px solid #b45309'
              }}
            >
              {/* Hydraulic cylinders */}
              <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: \`\${dims.width * 0.08}px\`,
                  height: \`\${dims.width * 0.08}px\`,
                  background: 'radial-gradient(circle at 30% 30%, #9ca3af 0%, #4b5563 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.5)'
                }}
              />
              <div
                className="absolute top-2/3 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: \`\${dims.width * 0.08}px\`,
                  height: \`\${dims.width * 0.08}px\`,
                  background: 'radial-gradient(circle at 30% 30%, #9ca3af 0%, #4b5563 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.5)'
                }}
              />
            </div>

            {/* Second boom segment */}
            <div
              className="absolute rounded-sm"
              style={{
                width: \`\${dims.width * 0.1}px\`,
                height: \`\${dims.height * 0.45}px\`,
                background: 'linear-gradient(to right, #f59e0b 0%, #fbbf24 50%, #f97316 100%)',
                transform: 'rotate(-65deg)',
                transformOrigin: 'bottom center',
                left: \`\${dims.width * 0.42}px\`,
                bottom: \`\${dims.height * 0.82}px\`,
                boxShadow: '0 2px 6px rgba(0,0,0,0.6), inset -2px 0 3px rgba(0,0,0,0.3)',
                border: '1px solid #d97706'
              }}
            />
            
            {/* Bucket with teeth */}
            <div
              className="absolute"
              style={{
                width: \`\${dims.width * 0.28}px\`,
                height: \`\${dims.height * 0.22}px\`,
                background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
                clipPath: 'polygon(0% 30%, 100% 0%, 100% 100%, 0% 100%)',
                left: \`\${dims.width * 0.42}px\`,
                bottom: \`\${dims.height * 1.18}px\`,
                boxShadow: '0 4px 10px rgba(0,0,0,0.8), inset 0 -2px 4px rgba(0,0,0,0.6)',
                border: '2px solid #292524'
              }}
            >
              {/* Bucket teeth */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-700"
                    style={{
                      width: \`\${dims.width * 0.04}px\`,
                      height: \`\${dims.width * 0.06}px\`,
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.8)'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Rotating cabin - enhanced */}
            <div
              className="relative rounded-lg overflow-hidden"
              style={{
                width: \`\${dims.width * 0.7}px\`,
                height: \`\${dims.height * 0.5}px\`,
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #dc2626 70%, #b91c1c 100%)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.7), inset 0 3px 6px rgba(255,255,255,0.25), inset 0 -2px 6px rgba(0,0,0,0.3)',
                border: '2px solid #b45309'
              }}
            >
              {/* Cabin windows */}
              <div
                className="absolute top-2 left-2 right-2 rounded-sm overflow-hidden"
                style={{
                  height: \`\${dims.height * 0.22}px\`,
                  background: 'linear-gradient(to bottom, #7dd3fc 0%, #38bdf8 50%, #0284c7 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 2px rgba(255,255,255,0.3)',
                  border: '2px solid rgba(0,0,0,0.4)'
                }}
              >
                {/* Sky/sun reflection */}
                <div
                  className="absolute top-0 left-1 rounded-full"
                  style={{
                    width: \`\${dims.width * 0.18}px\`,
                    height: \`\${dims.width * 0.12}px\`,
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)'
                  }}
                />
                {/* Window frame */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black/40" />
              </div>

              {/* Brand logo area */}
              <div
                className="absolute"
                style={{
                  top: \`\${dims.height * 0.26}px\`,
                  left: '4px',
                  right: '4px',
                  height: \`\${dims.height * 0.08}px\`,
                  background: 'linear-gradient(to right, #dc2626 0%, #b91c1c 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)'
                }}
              />

              {/* Warning stripes - reflective */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: \`\${dims.height * 0.1}px\`,
                  background: 'repeating-linear-gradient(45deg, #1f2937 0px, #1f2937 6px, #fbbf24 6px, #fbbf24 12px)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 0 8px rgba(251, 191, 36, 0.3)'
                }}
              />

              {/* Cabin details - grilles */}
              <div 
                className="absolute left-2 right-2 flex gap-0.5"
                style={{
                  bottom: \`\${dims.height * 0.12}px\`,
                  height: '4px'
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-black/50 rounded-sm"
                  />
                ))}
              </div>

              {/* Door handle */}
              <div
                className="absolute bg-gray-700 rounded-sm"
                style={{
                  left: '8px',
                  top: '50%',
                  width: \`\${dims.width * 0.06}px\`,
                  height: \`\${dims.width * 0.03}px\`,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.6)'
                }}
              />
            </div>
            
            {/* Tracks - highly detailed */}
            <div
              className="mt-1 rounded relative overflow-hidden"
              style={{
                width: \`\${dims.width * 0.75}px\`,
                height: \`\${dims.height * 0.2}px\`,
                background: 'linear-gradient(to bottom, #27272a 0%, #18181b 50%, #09090b 100%)',
                border: '2px solid #000',
                boxShadow: '0 3px 8px rgba(0,0,0,0.9), inset 0 3px 6px rgba(0,0,0,0.8)'
              }}
            >
              {/* Track treads */}
              <div className="absolute inset-0 flex">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-black/70 relative"
                    style={{
                      background: 'linear-gradient(to bottom, #3f3f46 0%, #27272a 50%, #18181b 100%)'
                    }}
                  >
                    {/* Track nubs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-600 rounded-sm" />
                  </div>
                ))}
              </div>
              {/* Drive wheels */}
              <div 
                className="absolute bottom-0 left-2 rounded-full"
                style={{ 
                  width: \`\${dims.width * 0.14}px\`, 
                  height: \`\${dims.width * 0.14}px\`,
                  background: 'radial-gradient(circle at 35% 35%, #52525b 0%, #27272a 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                <div className="absolute inset-2 rounded-full bg-gray-800 border border-black" />
              </div>
              <div 
                className="absolute bottom-0 right-2 rounded-full"
                style={{ 
                  width: \`\${dims.width * 0.14}px\`, 
                  height: \`\${dims.width * 0.14}px\`,
                  background: 'radial-gradient(circle at 35% 35%, #52525b 0%, #27272a 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                <div className="absolute inset-2 rounded-full bg-gray-800 border border-black" />
              </div>
              {/* Middle roller */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                style={{ 
                  width: \`\${dims.width * 0.1}px\`, 
                  height: \`\${dims.width * 0.1}px\`,
                  background: 'radial-gradient(circle at 35% 35%, #52525b 0%, #27272a 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
                }}
              />
            </div>
          </div>

          {/* Dump Truck - Photorealistic */}
          <div className="relative">
            {/* Truck bed (raised) - enhanced detail */}
            <div
              className="rounded relative overflow-hidden"
              style={{
                width: \`\${dims.width * 0.8}px\`,
                height: \`\${dims.height * 0.6}px\`,
                background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 30%, #c2410c 70%, #9a3412 100%)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.8), inset 0 3px 6px rgba(255,255,255,0.2), inset 0 -2px 6px rgba(0,0,0,0.4)',
                border: '2px solid #7c2d12',
                transform: 'rotate(-18deg)',
                transformOrigin: 'bottom right'
              }}
            >
              {/* Ribbed sides - realistic metal */}
              <div className="absolute inset-0 flex flex-col">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-b border-black/40 relative"
                    style={{
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                  />
                ))}
              </div>

              {/* Vertical ribs */}
              <div className="absolute inset-0 flex">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-black/30"
                    style={{
                      boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.1)'
                    }}
                  />
                ))}
              </div>

              {/* Dirt/gravel inside */}
              <div
                className="absolute inset-3 rounded-sm overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #78350f 0%, #713f12 50%, #451a03 100%)',
                  boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.7)'
                }}
              >
                {/* Dirt texture */}
                {[...Array(20)].map((_, j) => (
                  <div
                    key={j}
                    className="absolute rounded-full"
                    style={{
                      background: j % 3 === 0 ? '#92400e' : '#78350f',
                      width: \`\${2 + Math.random() * 6}px\`,
                      height: \`\${2 + Math.random() * 6}px\`,
                      left: \`\${Math.random() * 85}%\`,
                      top: \`\${Math.random() * 85}%\`,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}
                  />
                ))}
              </div>

              {/* Tailgate latch & hinges */}
              <div
                className="absolute bottom-1 right-1 bg-gray-900 rounded-sm"
                style={{
                  width: \`\${dims.width * 0.12}px\`,
                  height: \`\${dims.width * 0.06}px\`,
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 2px rgba(255,255,255,0.2)'
                }}
              />
              <div className="absolute bottom-1 left-1 w-1 h-1 bg-gray-800 rounded-full" />
              <div className="absolute bottom-1 left-3 w-1 h-1 bg-gray-800 rounded-full" />
            </div>

            {/* Hydraulic cylinders for bed */}
            <div
              className="absolute bottom-0 left-1/4 rounded-sm"
              style={{
                width: \`\${dims.width * 0.08}px\`,
                height: \`\${dims.height * 0.35}px\`,
                background: 'linear-gradient(to bottom, #71717a 0%, #52525b 100%)',
                transform: 'rotate(15deg)',
                transformOrigin: 'bottom center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.2)'
              }}
            />

            {/* Cab - photorealistic */}
            <div
              className="absolute bottom-0 right-0 rounded-lg overflow-hidden"
              style={{
                width: \`\${dims.width * 0.42}px\`,
                height: \`\${dims.height * 0.45}px\`,
                background: 'linear-gradient(135deg, #fde047 0%, #fbbf24 50%, #f59e0b 100%)',
                border: '2px solid #ca8a04',
                boxShadow: '0 6px 16px rgba(0,0,0,0.8), inset 0 3px 6px rgba(255,255,255,0.3), inset 0 -2px 6px rgba(0,0,0,0.2)'
              }}
            >
              {/* Windshield with realistic reflection */}
              <div
                className="absolute top-1 left-1 rounded-sm overflow-hidden"
                style={{
                  width: \`\${dims.width * 0.22}px\`,
                  height: \`\${dims.height * 0.2}px\`,
                  background: 'linear-gradient(to bottom, #bae6fd 0%, #7dd3fc 40%, #38bdf8 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(255,255,255,0.4)',
                  border: '2px solid rgba(0,0,0,0.5)'
                }}
              >
                {/* Sky/cloud reflection */}
                <div
                  className="absolute top-0 left-0 rounded-full"
                  style={{
                    width: \`\${dims.width * 0.12}px\`,
                    height: \`\${dims.width * 0.08}px\`,
                    background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, transparent 100%)'
                  }}
                />
                {/* Windshield wiper */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 rounded-full"
                  style={{
                    width: \`\${dims.width * 0.15}px\`,
                    height: '1px'
                  }}
                />
              </div>

              {/* Side mirror */}
              <div
                className="absolute top-1/4 -left-2 rounded-sm"
                style={{
                  width: \`\${dims.width * 0.1}px\`,
                  height: \`\${dims.width * 0.06}px\`,
                  background: 'linear-gradient(to right, #71717a 0%, #52525b 100%)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.6)'
                }}
              >
                <div className="absolute inset-0.5 bg-sky-400/70 rounded-sm" />
              </div>

              {/* Door panel with handle */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{ 
                  height: '45%',
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 100%)'
                }}
              >
                {/* Door handle */}
                <div
                  className="absolute top-1/3 left-1/3 rounded-sm"
                  style={{
                    width: \`\${dims.width * 0.08}px\`,
                    height: \`\${dims.width * 0.03}px\`,
                    background: 'radial-gradient(circle at 30% 30%, #a1a1aa 0%, #52525b 100%)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3)'
                  }}
                />
                {/* Door seam */}
                <div className="absolute top-0 left-1/4 bottom-0 w-px bg-black/30" />
              </div>

              {/* Headlight */}
              <div
                className="absolute bottom-2 left-1 rounded-full overflow-hidden"
                style={{
                  width: \`\${dims.width * 0.1}px\`,
                  height: \`\${dims.width * 0.1}px\`,
                  background: 'radial-gradient(circle at 35% 35%, #fef08a 0%, #fde047 50%, #facc15 100%)',
                  boxShadow: '0 0 12px rgba(250, 204, 21, 0.7), inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.3)',
                  border: '1px solid #ca8a04'
                }}
              >
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/60 rounded-full" />
              </div>

              {/* Grille */}
              <div
                className="absolute bottom-1 right-1 flex flex-col gap-0.5"
                style={{
                  width: \`\${dims.width * 0.15}px\`,
                  height: \`\${dims.width * 0.12}px\`
                }}
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-1 bg-black/60 rounded-sm" />
                ))}
              </div>
            </div>

            {/* Wheels - photorealistic */}
            {[0, 1].map((wheelIndex) => (
              <div
                key={wheelIndex}
                className="absolute -bottom-1 rounded-full"
                style={{
                  [wheelIndex === 0 ? 'left' : 'right']: '4px',
                  width: \`\${dims.width * 0.2}px\`,
                  height: \`\${dims.width * 0.2}px\`,
                  background: 'radial-gradient(circle at 35% 35%, #52525b 0%, #27272a 50%, #09090b 100%)',
                  boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.9), 0 3px 8px rgba(0,0,0,0.8)',
                  border: '2px solid #000'
                }}
              >
                {/* Tire tread */}
                <div className="absolute inset-1.5 rounded-full bg-gray-800">
                  <div className="absolute inset-1 rounded-full bg-gray-900 border border-gray-700" />
                  {/* Rim details */}
                  <div className="absolute inset-3 rounded-full" style={{
                    background: 'conic-gradient(from 0deg, #52525b 0deg, #3f3f46 60deg, #52525b 120deg, #3f3f46 180deg, #52525b 240deg, #3f3f46 300deg, #52525b 360deg)'
                  }}>
                    <div className="absolute inset-2 rounded-full bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}

            {/* Mud flap */}
            <div
              className="absolute -bottom-0.5 left-8 bg-black/80"
              style={{
                width: \`\${dims.width * 0.12}px\`,
                height: \`\${dims.width * 0.08}px\`,
                boxShadow: '0 1px 2px rgba(0,0,0,0.6)'
              }}
            />
          </div>

          {/* Construction Worker - More detailed */}
          <div className="relative" style={{ opacity: dims.opacity }}>
            {/* Hard hat */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-t-full overflow-hidden"
              style={{
                width: \`\${dims.width * 0.22}px\`,
                height: \`\${dims.width * 0.16}px\`,
                background: 'linear-gradient(135deg, #fde047 0%, #fbbf24 50%, #f59e0b 100%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
                border: '1px solid #ca8a04'
              }}
            >
              {/* Hat shine */}
              <div className="absolute top-0 left-1/4 w-1/3 h-1/2 bg-white/40 rounded-full" />
              {/* Hat brim shadow */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-black/40" />
            </div>

            {/* Head/face */}
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: \`\${dims.width * 0.18}px\`,
                height: \`\${dims.width * 0.12}px\`,
                background: '#fcd34d'
              }}
            />

            {/* Body - safety vest */}
            <div
              className="rounded-sm relative overflow-hidden"
              style={{
                width: \`\${dims.width * 0.28}px\`,
                height: \`\${dims.height * 0.45}px\`,
                background: 'linear-gradient(135deg, #ff6b00 0%, #f97316 50%, #ea580c 100%)',
                boxShadow: '0 3px 8px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.2)',
                border: '1px solid #c2410c'
              }}
            >
              {/* Reflective stripes */}
              <div className="absolute top-1/4 left-0 right-0 h-1 bg-lime-300" style={{ boxShadow: '0 0 4px rgba(190, 242, 100, 0.8)' }} />
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-lime-300" style={{ boxShadow: '0 0 4px rgba(190, 242, 100, 0.8)' }} />
              <div className="absolute top-3/4 left-0 right-0 h-1 bg-lime-300" style={{ boxShadow: '0 0 4px rgba(190, 242, 100, 0.8)' }} />
              
              {/* Vest details */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-px h-1/3 bg-black/40" />
            </div>

            {/* Arm holding STOP sign */}
            <div
              className="absolute top-1/4 -right-2 rounded"
              style={{
                width: \`\${dims.width * 0.18}px\`,
                height: \`\${dims.width * 0.06}px\`,
                background: 'linear-gradient(to right, #fdba74 0%, #fb923c 100%)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
              }}
            />

            {/* STOP paddle */}
            <div
              className="absolute -right-6 bg-red-600 rounded-full flex items-center justify-center"
              style={{
                top: '10%',
                width: \`\${dims.width * 0.25}px\`,
                height: \`\${dims.width * 0.25}px\`,
                border: '2px solid #7f1d1d',
                boxShadow: '0 3px 8px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.3)'
              }}
            >
              <div 
                className="text-white font-extrabold"
                style={{ 
                  fontSize: \`\${8 * (dims.width / 75)}px\`,
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}
              >
                STOP
              </div>
            </div>
          </div>
        </div>

        {/* Traffic cones - Photorealistic */}
        <div className="flex items-center justify-center gap-2" style={{ opacity: dims.opacity }}>
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="relative"
            >
              {/* Cone body */}
              <div
                className="relative"
                style={{
                  width: \`\${11 * (dims.width / 75)}px\`,
                  height: \`\${17 * (dims.width / 75)}px\`,
                  background: 'linear-gradient(to bottom, #ff6600 0%, #ff6600 30%, #fff 30%, #fff 35%, #ff6600 35%, #ff6600 60%, #fff 60%, #fff 65%, #ff6600 65%, #ff6600 100%)',
                  clipPath: 'polygon(50% 0%, 10% 100%, 90% 100%)',
                  animation: 'pulse 2s ease-in-out infinite',
                  animationDelay: \`\${i * 0.15}s\`,
                  boxShadow: '0 3px 8px rgba(0,0,0,0.7), inset 2px 0 4px rgba(255,255,255,0.3), inset -2px 0 4px rgba(0,0,0,0.3)',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'
                }}
              >
                {/* Reflective tape glow */}
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 30%, rgba(255,255,255,0.6) 32.5%, transparent 35%, transparent 60%, rgba(255,255,255,0.6) 62.5%, transparent 65%)',
                    clipPath: 'polygon(50% 0%, 10% 100%, 90% 100%)'
                  }}
                />
              </div>
              {/* Base - heavy rubber */}
              <div
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2"
                style={{
                  width: \`\${14 * (dims.width / 75)}px\`,
                  height: \`\${3 * (dims.width / 75)}px\`,
                  background: 'radial-gradient(ellipse at center, #27272a 0%, #18181b 50%, #09090b 100%)',
                  borderRadius: '50%',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.1)'
                }}
              />
            </div>
          ))}
        </div>

        {/* Dust/dirt particles in air */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: dims.opacity * 0.4 }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-amber-700/40 rounded-full animate-pulse"
              style={{
                width: \`\${2 + Math.random() * 4}px\`,
                height: \`\${2 + Math.random() * 4}px\`,
                left: \`\${20 + Math.random() * 60}%\`,
                top: \`\${30 + Math.random() * 40}%\`,
                animationDelay: \`\${i * 0.2}s\`,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
`;

export default enhancedConstructionScene;
