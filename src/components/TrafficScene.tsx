import { useEffect, useState } from 'react';

interface TrafficSceneProps {
  scenario: 'normal' | 'construction' | 'weather' | 'accident' | 'sensor-failure';
  distance?: number; // km to hazard
  isActive?: boolean; // Add this to know if scenario is running
  urgency?: 'low' | 'medium' | 'high'; // Add urgency level
}

interface Car {
  id: number;
  lane: number; // 0 or 2 (left or right - center lane is for our car)
  distanceAhead: number; // distance in front of us
  speed: number; // absolute speed (all moving forward)
  color: string;
  type: 'sedan' | 'suv' | 'truck';
}

export function TrafficScene({ scenario, distance, isActive = false, urgency = 'low' }: TrafficSceneProps) {
  const [roadOffset, setRoadOffset] = useState(0);
  const OUR_CAR_SPEED = 105; // km/h - our constant speed
  
  const [cars, setCars] = useState<Car[]>([
    { id: 1, lane: 0, distanceAhead: 150, speed: 60, color: '#EF4444', type: 'sedan' },
    { id: 2, lane: 2, distanceAhead: 250, speed: 70, color: '#3B82F6', type: 'suv' },
    { id: 3, lane: 0, distanceAhead: 350, speed: 68, color: '#FBBF24', type: 'sedan' },
    { id: 4, lane: 2, distanceAhead: 120, speed: 62, color: '#10B981', type: 'truck' },
    { id: 5, lane: 0, distanceAhead: 500, speed: 72, color: '#1F2937', type: 'sedan' },
    { id: 6, lane: 2, distanceAhead: 400, speed: 63, color: '#6B7280', type: 'suv' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoadOffset(prev => (prev + 5) % 100);
      
      setCars(prevCars => {
        const updatedCars = prevCars.map(car => {
          // Calculate relative speed to our car
          const relativeSpeed = car.speed - OUR_CAR_SPEED;
          let newDistance = car.distanceAhead + relativeSpeed * 0.1;
          
          // Reset cars that are too far behind or ahead
          if (newDistance < -80) {
            newDistance = 400 + Math.random() * 150;
          } else if (newDistance > 600) {
            newDistance = 80 + Math.random() * 100;
          }
          
          return {
            ...car,
            distanceAhead: newDistance
          };
        });

        // Prevent overlapping - check each car against others in same lane
        return updatedCars.map((car, index) => {
          const sameLaneCars = updatedCars.filter((c, i) => 
            i !== index && c.lane === car.lane
          );
          
          let adjustedDistance = car.distanceAhead;
          
          for (const otherCar of sameLaneCars) {
            const distanceDiff = Math.abs(adjustedDistance - otherCar.distanceAhead);
            // Increase minimum distance to 80 units
            if (distanceDiff < 80) {
              // Push car away from the other car
              if (adjustedDistance > otherCar.distanceAhead) {
                adjustedDistance = otherCar.distanceAhead + 80;
              } else {
                adjustedDistance = otherCar.distanceAhead - 80;
              }
            }
          }
          
          return {
            ...car,
            distanceAhead: adjustedDistance
          };
        });
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getSceneContent = () => {
    // Show incident visuals when close - NO IMAGES, pure CSS
    if (scenario === 'construction' && distance !== undefined && distance < 0.5) {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-orange-400 to-orange-500">
          {/* Construction zone pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #f97316 0px,
              #f97316 20px,
              #fbbf24 20px,
              #fbbf24 40px
            )`,
            opacity: 0.3
          }} />
          {/* Construction cones */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${15 + (i % 4) * 25}%`,
                top: `${30 + Math.floor(i / 4) * 30}%`,
                width: '30px',
                height: '40px',
                background: 'linear-gradient(to bottom, #f97316 0%, #f97316 70%, #1f2937 70%, #1f2937 100%)',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
              }}
            />
          ))}
        </div>
      );
    }

    if (scenario === 'weather' && distance !== undefined && distance < 0.5) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Heavy rain/fog indicator */}
          <div 
            className="bg-slate-700/80 rounded-lg p-4 backdrop-blur-sm animate-pulse"
            style={{ opacity: 0.9 }}
          >
            <div className="text-center text-slate-300 font-bold text-xl">
              ⚠ LOW VISIBILITY
            </div>
          </div>
        </div>
      );
    }

    if (scenario === 'accident') {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-red-900 via-orange-800 to-yellow-700">
          {/* Emergency vehicle lights flashing */}
          <div 
            className="absolute inset-0"
            style={{
              background: Math.floor(roadOffset / 10) % 2 === 0 
                ? 'radial-gradient(circle at 30% 50%, rgba(239, 68, 68, 0.6) 0%, transparent 40%)'
                : 'radial-gradient(circle at 70% 50%, rgba(59, 130, 246, 0.6) 0%, transparent 40%)'
            }}
          />
          {/* Crashed vehicles (simple shapes) */}
          <div className="absolute left-[25%] top-[40%] w-16 h-24 bg-gray-600 rounded-lg transform rotate-45" />
          <div className="absolute left-[60%] top-[35%] w-16 h-24 bg-gray-700 rounded-lg transform -rotate-30" />
        </div>
      );
    }

    if (scenario === 'sensor-failure') {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-red-500 text-center space-y-2">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm">Sensor data compromised</p>
            </div>
          </div>
          {/* Static noise effect */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(200)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random()
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    // Normal driving scene - pure CSS sky and horizon
    return (
      <div className="absolute inset-0">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500 via-sky-400 to-sky-300" />
        
        {/* Clouds */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/40 rounded-full blur-xl"
            style={{
              left: `${i * 18}%`,
              top: `${5 + (i % 3) * 8}%`,
              width: `${80 + Math.random() * 40}px`,
              height: `${30 + Math.random() * 20}px`,
            }}
          />
        ))}
        
        {/* Horizon line */}
        <div className="absolute left-0 right-0 h-1/3 bg-gradient-to-b from-green-600/30 to-transparent" style={{ top: '25%' }} />
        
        {/* Distant trees/landscape */}
        <div className="absolute left-0 right-0" style={{ top: '28%', height: '8%' }}>
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-green-700/50 blur-sm"
              style={{
                left: `${i * 4}%`,
                width: '3%',
                height: `${40 + Math.random() * 60}%`,
                bottom: 0
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const getLanePosition = (lane: number) => {
    const lanePositions = [30, 70];
    return lanePositions[lane === 0 ? 0 : 1];
  };

  const distanceToScreenPosition = (distance: number) => {
    if (distance < 0) return 110;
    
    const maxDistance = 500;
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    return 90 - (normalizedDistance * 90);
  };

  const getCarDimensions = (distance: number, type: 'sedan' | 'suv' | 'truck') => {
    const baseSizes = {
      sedan: { width: 65, height: 110 },
      suv: { width: 75, height: 120 },
      truck: { width: 80, height: 140 }
    };
    
    const base = baseSizes[type];
    const maxDistance = 500;
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    const scale = 1.0 - (normalizedDistance * 0.75);
    
    return {
      width: base.width * scale,
      height: base.height * scale,
      opacity: Math.max(0.5, 0.95 - normalizedDistance * 0.3),
      blur: normalizedDistance > 0.75 ? 0.5 : 0
    };
  };

  const renderCar = (car: Car) => {
    const screenY = distanceToScreenPosition(car.distanceAhead);
    const dims = getCarDimensions(car.distanceAhead, car.type);
    const leftPos = getLanePosition(car.lane);
    
    if (screenY < -10 || screenY > 105) return null;

    const isTruck = car.type === 'truck';
    const isSUV = car.type === 'suv';
    const isSlowerThanUs = car.speed < OUR_CAR_SPEED;

    return (
      <div
        key={car.id}
        className="absolute transition-all duration-100"
        style={{
          left: `${leftPos}%`,
          top: `${screenY}%`,
          width: `${dims.width}px`,
          height: `${dims.height}px`,
          opacity: dims.opacity,
          transform: 'translate(-50%, -50%)',
          filter: dims.blur > 0 ? `blur(${dims.blur}px)` : 'none'
        }}
      >
        <div className="relative w-full h-full">
          <div 
            className="absolute inset-0 rounded-md"
            style={{ 
              background: `linear-gradient(180deg, ${car.color} 0%, ${car.color}dd 50%, ${car.color}aa 100%)`,
              boxShadow: '0 4px 15px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            <div 
              className="absolute left-[15%] right-[15%] rounded-t-lg"
              style={{
                top: isTruck ? '40%' : isSUV ? '25%' : '20%',
                height: isTruck ? '25%' : isSUV ? '35%' : '35%',
                background: 'linear-gradient(180deg, rgba(100, 150, 200, 0.7) 0%, rgba(60, 100, 150, 0.5) 100%)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div 
                className="absolute inset-x-0 top-0 h-[40%] rounded-t-lg"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)'
                }}
              />
            </div>

            <div 
              className="absolute left-[20%] right-[20%]"
              style={{
                top: isTruck ? '65%' : isSUV ? '60%' : '55%',
                height: '12%',
                background: 'linear-gradient(180deg, rgba(40, 60, 80, 0.8) 0%, rgba(20, 30, 40, 0.6) 100%)',
                border: '1px solid rgba(0,0,0,0.3)'
              }}
            />

            <div 
              className="absolute left-[12%] rounded-sm"
              style={{
                bottom: '6%',
                width: '22%',
                height: '10%',
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                boxShadow: isSlowerThanUs
                  ? '0 0 10px rgba(220, 38, 38, 0.8), inset 0 1px 0 rgba(255,255,255,0.3)' 
                  : '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                border: '1px solid rgba(0,0,0,0.4)'
              }}
            >
              {isSlowerThanUs && (
                <div className="absolute inset-0 bg-red-400 rounded-sm animate-pulse opacity-60" />
              )}
            </div>
            
            <div 
              className="absolute right-[12%] rounded-sm"
              style={{
                bottom: '6%',
                width: '22%',
                height: '10%',
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                boxShadow: isSlowerThanUs
                  ? '0 0 10px rgba(220, 38, 38, 0.8), inset 0 1px 0 rgba(255,255,255,0.3)' 
                  : '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                border: '1px solid rgba(0,0,0,0.4)'
              }}
            >
              {isSlowerThanUs && (
                <div className="absolute inset-0 bg-red-400 rounded-sm animate-pulse opacity-60" />
              )}
            </div>

            {dims.width > 40 && (
              <>
                <div 
                  className="absolute rounded-full"
                  style={{
                    top: isTruck ? '45%' : '35%',
                    left: '-8%',
                    width: '15%',
                    height: '8%',
                    background: `linear-gradient(90deg, ${car.color} 0%, ${car.color}cc 100%)`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                  }}
                />
                <div 
                  className="absolute rounded-full"
                  style={{
                    top: isTruck ? '45%' : '35%',
                    right: '-8%',
                    width: '15%',
                    height: '8%',
                    background: `linear-gradient(270deg, ${car.color} 0%, ${car.color}cc 100%)`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                  }}
                />
              </>
            )}

            <div 
              className="absolute left-1/2 -translate-x-1/2 bg-white rounded-sm"
              style={{
                bottom: '2%',
                width: '35%',
                height: '5%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
            />

            <div 
              className="absolute inset-0 rounded-md pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)'
              }}
            />

            <div className="absolute left-0 right-0 top-1/2 h-px bg-black/20" />
          </div>

          {dims.width > 30 && (
            <>
              <div 
                className="absolute bg-black rounded-full"
                style={{
                  bottom: '8%',
                  left: '15%',
                  width: '18%',
                  height: dims.height > 60 ? '12%' : '10%',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 0 2px 3px rgba(0,0,0,0.4)'
                }}
              >
                <div className="absolute inset-1 bg-gray-600 rounded-full" />
                <div className="absolute inset-2 bg-gray-800 rounded-full" />
              </div>
              <div 
                className="absolute bg-black rounded-full"
                style={{
                  bottom: '8%',
                  right: '15%',
                  width: '18%',
                  height: dims.height > 60 ? '12%' : '10%',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 0 2px 3px rgba(0,0,0,0.4)'
                }}
              >
                <div className="absolute inset-1 bg-gray-600 rounded-full" />
                <div className="absolute inset-2 bg-gray-800 rounded-full" />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render hazard in center lane when urgency is high
  const renderCenterLaneHazard = () => {
    if (urgency !== 'high' || !isActive) return null;

    // Position hazard ahead of our car (which is at 90% from top)
    // Map distance to screen position: closer = bigger and lower on screen (but still above our car)
    const distanceInKm = distance || 0.5;
    // When distance is 0.8 km -> position at 5% (far ahead, near horizon)
    // When distance is 0.2 km -> position at 25% (closer but still well above car at 90%)
    const screenY = Math.max(5, Math.min(30, 35 - (distanceInKm * 60)));
    
    // Calculate size based on distance - closer = bigger
    const sizeScale = Math.max(0.5, Math.min(1.5, 1.8 - distanceInKm * 2.5));
    const baseWidth = 75;
    const baseHeight = 110;
    
    const dims = {
      width: baseWidth * sizeScale,
      height: baseHeight * sizeScale,
      opacity: Math.max(0.8, 1 - distanceInKm * 0.3)
    };

    if (scenario === 'construction') {
      return (
        <div
          className="absolute"
          style={{
            left: '50%',
            top: `${screenY}%`,
            transform: 'translate(-50%, -50%)',
            width: `${dims.width * 3}px`,
            zIndex: 1
          }}
        >
          {/* Construction Scene - organized top to bottom */}
          <div className="relative flex flex-col items-center gap-1">
            {/* Warning text at very top */}
            <div 
              className="text-center text-orange-500 font-bold animate-pulse mb-1"
              style={{ 
                fontSize: `${10 * (dims.width / 75)}px`,
                opacity: dims.opacity,
                textShadow: '0 0 10px rgba(249, 115, 22, 0.8)'
              }}
            >
              ⚠ CONSTRUCTION ZONE - TAKE CONTROL ⚠
            </div>

            {/* Warning Signs */}
            <div className="flex gap-2 mb-2" style={{ opacity: dims.opacity }}>
              {/* Diamond Warning Sign */}
              <div
                className="relative"
                style={{
                  width: `${dims.width * 0.5}px`,
                  height: `${dims.width * 0.5}px`,
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.3)',
                  border: '3px solid #dc2626'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="text-black font-extrabold"
                    style={{ 
                      fontSize: `${14 * (dims.width / 75)}px`,
                      filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))'
                    }}
                  >
                    🚧
                  </div>
                </div>
              </div>
              
              {/* Speed Limit Sign */}
              <div
                className="bg-white rounded-lg flex items-center justify-center relative overflow-hidden"
                style={{
                  width: `${dims.width * 0.4}px`,
                  height: `${dims.width * 0.5}px`,
                  border: '4px solid #dc2626',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.8)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-200 opacity-50" />
                <div className="text-center relative z-10">
                  <div 
                    className="text-black font-bold"
                    style={{ fontSize: `${8 * (dims.width / 75)}px` }}
                  >
                    SPEED
                  </div>
                  <div 
                    className="text-black font-extrabold"
                    style={{ fontSize: `${20 * (dims.width / 75)}px` }}
                  >
                    25
                  </div>
                </div>
              </div>
            </div>

            {/* Jersey Barriers */}
            <div className="flex gap-1 mb-2" style={{ opacity: dims.opacity }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="relative"
                  style={{
                    width: `${dims.width * 0.45}px`,
                    height: `${dims.height * 0.28}px`,
                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to bottom, #d4d4d4 0%, #a3a3a3 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Orange reflective stripe */}
                    <div
                      className="absolute left-0 right-0"
                      style={{
                        top: '45%',
                        height: '10%',
                        background: '#f97316',
                        boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)'
                      }}
                    />
                    {/* Concrete texture spots */}
                    {[...Array(3)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute bg-gray-600/30 rounded-full"
                        style={{
                          width: `${2 + Math.random() * 4}px`,
                          height: `${2 + Math.random() * 4}px`,
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Construction vehicles and equipment */}
            <div className="flex items-end justify-center gap-2 mb-1" style={{ opacity: dims.opacity }}>
              {/* Excavator - Enhanced */}
              <div className="relative">
                {/* Boom arm */}
                <div
                  className="absolute rounded-sm"
                  style={{
                    width: `${dims.width * 0.12}px`,
                    height: `${dims.height * 0.5}px`,
                    background: 'linear-gradient(to right, #f59e0b 0%, #fbbf24 50%, #f97316 100%)',
                    transform: 'rotate(-38deg)',
                    transformOrigin: 'bottom center',
                    left: `${dims.width * 0.28}px`,
                    bottom: `${dims.height * 0.32}px`,
                    boxShadow: '0 3px 8px rgba(0,0,0,0.6), inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(255,255,255,0.2)',
                    border: '1px solid #b45309'
                  }}
                >
                  {/* Hydraulic cylinder */}
                  <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      width: `${dims.width * 0.08}px`,
                      height: `${dims.width * 0.08}px`,
                      background: 'radial-gradient(circle at 30% 30%, #9ca3af 0%, #4b5563 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.7)'
                    }}
                  />
                </div>
                
                {/* Bucket */}
                <div
                  className="absolute"
                  style={{
                    width: `${dims.width * 0.25}px`,
                    height: `${dims.height * 0.2}px`,
                    background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
                    clipPath: 'polygon(0% 30%, 100% 0%, 100% 100%, 0% 100%)',
                    left: `${dims.width * 0.36}px`,
                    bottom: `${dims.height * 0.7}px`,
                    boxShadow: '0 3px 8px rgba(0,0,0,0.8)',
                    border: '1px solid #292524'
                  }}
                />

                {/* Cabin - Enhanced */}
                <div 
                  className="rounded-lg overflow-hidden relative"
                  style={{
                    width: `${dims.width * 0.65}px`,
                    height: `${dims.height * 0.45}px`,
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.25)',
                    border: '2px solid #b45309'
                  }}
                >
                  {/* Window with reflection */}
                  <div 
                    className="absolute top-2 left-2 right-2 rounded-sm overflow-hidden"
                    style={{
                      height: `${dims.height * 0.2}px`,
                      background: 'linear-gradient(to bottom, #7dd3fc 0%, #38bdf8 50%, #0284c7 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                      border: '2px solid rgba(0,0,0,0.3)'
                    }}
                  >
                    {/* Sky reflection */}
                    <div
                      className="absolute top-0 left-1 rounded-full"
                      style={{
                        width: `${dims.width * 0.15}px`,
                        height: `${dims.width * 0.1}px`,
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)'
                      }}
                    />
                  </div>
                  
                  {/* Warning stripes */}
                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      height: `${dims.height * 0.08}px`,
                      background: 'repeating-linear-gradient(45deg, #1f2937 0px, #1f2937 6px, #fbbf24 6px, #fbbf24 12px)',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)'
                    }}
                  />
                </div>
                
                {/* Tracks - Enhanced */}
                <div 
                  className="mt-1 rounded relative overflow-hidden"
                  style={{
                    width: `${dims.width * 0.7}px`,
                    height: `${dims.height * 0.18}px`,
                    background: 'linear-gradient(to bottom, #27272a 0%, #18181b 50%, #09090b 100%)',
                    border: '2px solid #000',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.9), inset 0 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {/* Track treads */}
                  <div className="absolute inset-0 flex">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-r border-black/50"
                        style={{
                          background: 'linear-gradient(to bottom, #374151 0%, #1f2937 100%)'
                        }}
                      />
                    ))}
                  </div>
                  {/* Drive wheels */}
                  <div 
                    className="absolute bottom-0 left-2 rounded-full"
                    style={{ 
                      width: `${dims.width * 0.12}px`, 
                      height: `${dims.width * 0.12}px`,
                      background: 'radial-gradient(circle at 35% 35%, #52525b 0%, #27272a 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
                    }}
                  />
                  <div 
                    className="absolute bottom-0 right-2 rounded-full"
                    style={{ 
                      width: `${dims.width * 0.12}px`, 
                      height: `${dims.width * 0.12}px`,
                      background: 'radial-gradient(circle at 35% 35%, #52525b 0%, #27272a 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
                    }}
                  />
                </div>
              </div>

              {/* Dump Truck - Enhanced */}
              <div className="relative">
                {/* Truck bed (raised) */}
                <div 
                  className="rounded relative overflow-hidden"
                  style={{
                    width: `${dims.width * 0.75}px`,
                    height: `${dims.height * 0.55}px`,
                    background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 30%, #c2410c 70%, #9a3412 100%)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.8), inset 0 3px 6px rgba(255,255,255,0.2), inset 0 -2px 6px rgba(0,0,0,0.4)',
                    border: '2px solid #7c2d12',
                    transform: 'rotate(-15deg)',
                    transformOrigin: 'bottom right'
                  }}
                >
                  {/* Ribbed sides */}
                  <div className="absolute inset-0 flex flex-col">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-b border-black/30"
                        style={{
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Dirt/gravel inside */}
                  <div 
                    className="absolute inset-3 rounded-sm overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.7)'
                    }}
                  >
                    {/* Dirt texture */}
                    {[...Array(15)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute rounded-full"
                        style={{
                          background: j % 2 === 0 ? '#92400e' : '#78350f',
                          width: `${2 + Math.random() * 6}px`,
                          height: `${2 + Math.random() * 6}px`,
                          left: `${Math.random() * 85}%`,
                          top: `${Math.random() * 85}%`,
                          boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Cab - Enhanced */}
                <div 
                  className="absolute bottom-0 right-0 rounded-lg overflow-hidden"
                  style={{
                    width: `${dims.width * 0.42}px`,
                    height: `${dims.height * 0.42}px`,
                    background: 'linear-gradient(135deg, #fde047 0%, #fbbf24 50%, #f59e0b 100%)',
                    border: '2px solid #ca8a04',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.8), inset 0 3px 6px rgba(255,255,255,0.3)'
                  }}
                >
                  {/* Windshield with reflection */}
                  <div 
                    className="absolute top-1 left-1 rounded-sm overflow-hidden"
                    style={{
                      width: `${dims.width * 0.22}px`,
                      height: `${dims.height * 0.18}px`,
                      background: 'linear-gradient(to bottom, #bae6fd 0%, #7dd3fc 40%, #38bdf8 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                      border: '2px solid rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Sun reflection */}
                    <div
                      className="absolute top-0 left-0 rounded-full"
                      style={{
                        width: `${dims.width * 0.1}px`,
                        height: `${dims.width * 0.07}px`,
                        background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, transparent 100%)'
                      }}
                    />
                  </div>
                  
                  {/* Headlight */}
                  <div
                    className="absolute bottom-2 left-1 rounded-full overflow-hidden"
                    style={{
                      width: `${dims.width * 0.09}px`,
                      height: `${dims.width * 0.09}px`,
                      background: 'radial-gradient(circle at 35% 35%, #fef08a 0%, #fde047 50%, #facc15 100%)',
                      boxShadow: '0 0 10px rgba(250, 204, 21, 0.6), inset 0 2px 4px rgba(255,255,255,0.5)',
                      border: '1px solid #ca8a04'
                    }}
                  >
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/60 rounded-full" />
                  </div>
                </div>
                
                {/* Wheels - Enhanced */}
                {[0, 1].map((wheelIndex) => (
                  <div 
                    key={wheelIndex}
                    className="absolute -bottom-1 rounded-full"
                    style={{
                      [wheelIndex === 0 ? 'left' : 'right']: '3px',
                      width: `${dims.width * 0.18}px`,
                      height: `${dims.width * 0.18}px`,
                      background: 'radial-gradient(circle at 35% 35%, #52525b 0%, #27272a 50%, #09090b 100%)',
                      boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.8)',
                      border: '2px solid #000'
                    }}
                  >
                    <div className="absolute inset-1 rounded-full bg-gray-800">
                      <div className="absolute inset-1 rounded-full bg-gray-900 border border-gray-700" />
                      <div className="absolute inset-2 rounded-full bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic cones - Enhanced realism */}
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
                      width: `${10 * (dims.width / 75)}px`,
                      height: `${16 * (dims.width / 75)}px`,
                      background: 'linear-gradient(to bottom, #ff6600 0%, #ff6600 32%, #fff 32%, #fff 36%, #ff6600 36%, #ff6600 60%, #fff 60%, #fff 64%, #ff6600 64%, #ff6600 100%)',
                      clipPath: 'polygon(50% 0%, 10% 100%, 90% 100%)',
                      animation: 'pulse 2s ease-in-out infinite',
                      animationDelay: `${i * 0.15}s`,
                      boxShadow: '0 3px 8px rgba(0,0,0,0.7), inset 2px 0 4px rgba(255,255,255,0.3), inset -2px 0 4px rgba(0,0,0,0.3)',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'
                    }}
                  >
                    {/* Reflective stripe glow */}
                    <div 
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 32%, rgba(255,255,255,0.6) 34%, transparent 36%, transparent 60%, rgba(255,255,255,0.6) 62%, transparent 64%)',
                        clipPath: 'polygon(50% 0%, 10% 100%, 90% 100%)'
                      }}
                    />
                  </div>
                  {/* Base - heavy rubber */}
                  <div
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2"
                    style={{
                      width: `${13 * (dims.width / 75)}px`,
                      height: `${3 * (dims.width / 75)}px`,
                      background: 'radial-gradient(ellipse at center, #27272a 0%, #18181b 50%, #09090b 100%)',
                      borderRadius: '50%',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.1)'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Dust/dirt particles in air - Construction atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: dims.opacity * 0.5 }}>
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-amber-700/40 rounded-full animate-pulse"
                  style={{
                    width: `${2 + Math.random() * 5}px`,
                    height: `${2 + Math.random() * 5}px`,
                    left: `${15 + Math.random() * 70}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.2}s`,
                    filter: 'blur(1.5px)',
                    boxShadow: '0 0 3px rgba(180, 83, 9, 0.4)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (scenario === 'accident') {
      return (
        <div
          className="absolute"
          style={{
            left: '50%',
            top: `${screenY}%`,
            transform: 'translate(-50%, -50%)',
            width: `${dims.width * 3}px`,
            zIndex: 1
          }}
        >
          {/* Accident Scene - organized top to bottom */}
          <div className="relative flex flex-col items-center gap-1">
            {/* Warning text at very top */}
            <div 
              className="text-center text-red-500 font-bold animate-pulse mb-1"
              style={{ 
                fontSize: `${10 * (dims.width / 75)}px`,
                opacity: dims.opacity,
                textShadow: '0 0 10px rgba(239, 68, 68, 0.8)'
              }}
            >
              ⚠ ACCIDENT AHEAD - TAKE CONTROL IMMEDIATELY ⚠
            </div>

            {/* Warning barrier/caution tape */}
            <div 
              className="flex items-center justify-center mb-1"
              style={{ opacity: dims.opacity }}
            >
              <div 
                className="border-4 border-red-500 bg-black/40 rounded px-4 py-2"
                style={{
                  borderStyle: 'dashed',
                  width: `${dims.width * 2.5}px`
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <div 
                    className="bg-red-500 text-white font-bold text-center animate-pulse px-2 py-1 rounded"
                    style={{ fontSize: `${10 * (dims.width / 75)}px` }}
                  >
                    🚨 ACCIDENT - ROAD BLOCKED
                  </div>
                </div>
              </div>
            </div>

            {/* Crashed vehicles - Enhanced */}
            <div className="flex items-end justify-center gap-2 mb-1" style={{ opacity: dims.opacity }}>
              {/* Crashed Car 1 - Tilted left with realistic damage */}
              <div className="relative">
                <div 
                  className="rounded-lg relative overflow-hidden"
                  style={{
                    width: `${dims.width * 0.6}px`,
                    height: `${dims.height * 0.7}px`,
                    background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 50%, #450a0a 100%)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.8), inset 0 -2px 8px rgba(0,0,0,0.6)',
                    border: '2px solid #1c0a0a',
                    transform: 'rotate(-28deg)',
                  }}
                >
                  {/* Broken windshield with cracks */}
                  <div 
                    className="absolute top-1 left-1 right-1 rounded-t overflow-hidden"
                    style={{
                      height: `${dims.height * 0.28}px`,
                      background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.4) 0%, rgba(125, 211, 252, 0.3) 50%, rgba(220, 38, 38, 0.3) 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
                      border: '1px solid rgba(0,0,0,0.4)'
                    }}
                  >
                    {/* Shatter pattern */}
                    <div className="absolute inset-0">
                      {[...Array(8)].map((_, j) => (
                        <div
                          key={j}
                          className="absolute bg-white/20"
                          style={{
                            width: '1px',
                            height: `${20 + Math.random() * 30}%`,
                            left: `${10 + j * 12}%`,
                            top: `${Math.random() * 50}%`,
                            transform: `rotate(${-45 + Math.random() * 90}deg)`,
                            transformOrigin: 'top'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Damage dents and scratches */}
                  <div className="absolute inset-0 rounded-lg">
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.4) 10px, rgba(0,0,0,0.4) 11px)'
                      }}
                    />
                    {/* Dent shadows */}
                    {[...Array(4)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute rounded-full"
                        style={{
                          width: `${15 + Math.random() * 20}px`,
                          height: `${15 + Math.random() * 20}px`,
                          background: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 70%)',
                          left: `${10 + Math.random() * 60}%`,
                          top: `${30 + Math.random() * 50}%`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Broken headlight */}
                  <div 
                    className="absolute bottom-2 left-2 rounded-sm"
                    style={{
                      width: `${dims.width * 0.12}px`,
                      height: `${dims.width * 0.08}px`,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(100,100,100,0.3) 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
                      border: '1px solid #1f2937'
                    }}
                  />
                </div>
                
                {/* Wheel debris and parts */}
                <div 
                  className="absolute -bottom-1 left-0 rounded-full"
                  style={{
                    width: `${dims.width * 0.12}px`,
                    height: `${dims.width * 0.12}px`,
                    background: 'radial-gradient(circle at 40% 40%, #52525b 0%, #27272a 50%, #18181b 100%)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.8), inset 0 2px 4px rgba(0,0,0,0.6)'
                  }}
                />
                
                {/* Smoke/steam effect */}
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="absolute rounded-full animate-pulse"
                    style={{
                      width: `${10 + j * 8}px`,
                      height: `${10 + j * 8}px`,
                      background: 'radial-gradient(circle, rgba(156, 163, 175, 0.4) 0%, transparent 70%)',
                      left: `${30 + j * 10}%`,
                      top: `-${5 + j * 8}px`,
                      animationDelay: `${j * 0.3}s`,
                      filter: 'blur(3px)'
                    }}
                  />
                ))}
              </div>

              {/* Emergency Vehicle - Ambulance Enhanced */}
              <div className="relative">
                {/* Vehicle body */}
                <div 
                  className="rounded-lg relative overflow-hidden"
                  style={{
                    width: `${dims.width * 0.75}px`,
                    height: `${dims.height * 0.65}px`,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 50%, #e5e7eb 100%)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.7), inset 0 3px 6px rgba(255,255,255,0.8), inset 0 -2px 6px rgba(0,0,0,0.2)',
                    border: '2px solid #d1d5db'
                  }}
                >
                  {/* Windshield */}
                  <div 
                    className="absolute top-2 left-2 rounded-sm overflow-hidden"
                    style={{
                      width: `${dims.width * 0.3}px`,
                      height: `${dims.height * 0.22}px`,
                      background: 'linear-gradient(to bottom, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                      border: '2px solid rgba(0,0,0,0.3)'
                    }}
                  >
                    {/* Reflection */}
                    <div
                      className="absolute top-0 left-1 rounded-full"
                      style={{
                        width: `${dims.width * 0.12}px`,
                        height: `${dims.width * 0.08}px`,
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)'
                      }}
                    />
                  </div>

                  {/* Red cross / Emergency symbol - 3D effect */}
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: `${dims.width * 0.32}px`,
                      height: `${dims.width * 0.32}px`
                    }}
                  >
                    <div 
                      className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1/3 rounded-sm"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        boxShadow: '0 2px 6px rgba(220, 38, 38, 0.6), inset 0 2px 4px rgba(255,255,255,0.3)'
                      }}
                    />
                    <div 
                      className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/3 rounded-sm"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        boxShadow: '0 2px 6px rgba(220, 38, 38, 0.6), inset 0 2px 4px rgba(255,255,255,0.3)'
                      }}
                    />
                  </div>
                  
                  {/* AMBULANCE text */}
                  <div 
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-600 rounded-sm px-1"
                    style={{
                      boxShadow: '0 2px 4px rgba(0,0,0,0.6)'
                    }}
                  >
                    <div 
                      className="text-white font-extrabold"
                      style={{ 
                        fontSize: `${6 * (dims.width / 75)}px`,
                        letterSpacing: '0.5px'
                      }}
                    >
                      AMBULANCE
                    </div>
                  </div>
                  
                  {/* Emergency light bar on top - Enhanced */}
                  <div 
                    className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-900 rounded-sm flex gap-1 px-1 py-0.5"
                    style={{
                      width: `${dims.width * 0.5}px`,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.8)'
                    }}
                  >
                    <div 
                      className="rounded-full animate-pulse"
                      style={{
                        width: `${dims.width * 0.12}px`,
                        height: `${dims.width * 0.1}px`,
                        background: 'radial-gradient(circle at 40% 40%, #fca5a5 0%, #ef4444 50%, #dc2626 100%)',
                        boxShadow: '0 0 20px rgba(239, 68, 68, 1), 0 0 40px rgba(239, 68, 68, 0.5)',
                        animationDuration: '1s'
                      }}
                    />
                    <div 
                      className="rounded-full animate-pulse"
                      style={{
                        width: `${dims.width * 0.12}px`,
                        height: `${dims.width * 0.1}px`,
                        background: 'radial-gradient(circle at 40% 40%, #93c5fd 0%, #3b82f6 50%, #2563eb 100%)',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 1), 0 0 40px rgba(59, 130, 246, 0.5)',
                        animationDelay: '0.5s',
                        animationDuration: '1s'
                      }}
                    />
                    <div 
                      className="rounded-full animate-pulse"
                      style={{
                        width: `${dims.width * 0.12}px`,
                        height: `${dims.width * 0.1}px`,
                        background: 'radial-gradient(circle at 40% 40%, #fca5a5 0%, #ef4444 50%, #dc2626 100%)',
                        boxShadow: '0 0 20px rgba(239, 68, 68, 1), 0 0 40px rgba(239, 68, 68, 0.5)',
                        animationDelay: '1s',
                        animationDuration: '1s'
                      }}
                    />
                  </div>
                  
                  {/* Side panels detail */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-transparent to-black/10" />
                </div>
                
                {/* Wheels - Enhanced */}
                {[0, 1].map((wheelIndex) => (
                  <div 
                    key={wheelIndex}
                    className="absolute -bottom-1 rounded-full"
                    style={{
                      [wheelIndex === 0 ? 'left' : 'right']: '4px',
                      width: `${dims.width * 0.16}px`,
                      height: `${dims.width * 0.16}px`,
                      background: 'radial-gradient(circle at 35% 35%, #52525b 0%, #27272a 50%, #09090b 100%)',
                      boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.8)',
                      border: '2px solid #000'
                    }}
                  >
                    <div className="absolute inset-1.5 rounded-full bg-gray-800">
                      <div className="absolute inset-1 rounded-full bg-gray-900 border border-gray-700" />
                      <div className="absolute inset-2 rounded-full bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Crashed Car 2 - Tilted right with enhanced damage */}
              <div className="relative">
                <div 
                  className="rounded-lg relative overflow-hidden"
                  style={{
                    width: `${dims.width * 0.58}px`,
                    height: `${dims.height * 0.68}px`,
                    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.8), inset 0 -2px 8px rgba(0,0,0,0.6)',
                    border: '2px solid #1f2937',
                    transform: 'rotate(22deg)',
                  }}
                >
                  {/* Broken windshield with cracks */}
                  <div 
                    className="absolute top-1 left-1 right-1 rounded-t overflow-hidden"
                    style={{
                      height: `${dims.height * 0.24}px`,
                      background: 'linear-gradient(135deg, rgba(186, 230, 253, 0.3) 0%, rgba(125, 211, 252, 0.2) 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
                      border: '1px solid rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Shatter lines */}
                    {[...Array(6)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute bg-white/25"
                        style={{
                          width: '1px',
                          height: `${15 + Math.random() * 25}%`,
                          left: `${15 + j * 15}%`,
                          top: `${Math.random() * 60}%`,
                          transform: `rotate(${-60 + Math.random() * 120}deg)`,
                          transformOrigin: 'top'
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Damage patterns */}
                  <div className="absolute inset-0 rounded-lg">
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(0,0,0,0.4) 8px, rgba(0,0,0,0.4) 9px)'
                      }}
                    />
                    {/* Dent depressions */}
                    {[...Array(5)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute rounded-full"
                        style={{
                          width: `${12 + Math.random() * 18}px`,
                          height: `${12 + Math.random() * 18}px`,
                          background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, transparent 70%)',
                          left: `${15 + Math.random() * 60}%`,
                          top: `${35 + Math.random() * 45}%`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Crushed side panel */}
                  <div 
                    className="absolute right-0 top-1/4 bottom-1/4 w-1/4"
                    style={{
                      background: 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, transparent 100%)',
                      clipPath: 'polygon(100% 0%, 60% 10%, 50% 50%, 60% 90%, 100% 100%)'
                    }}
                  />
                  
                  {/* Broken taillight */}
                  <div 
                    className="absolute bottom-2 right-2 rounded-sm"
                    style={{
                      width: `${dims.width * 0.1}px`,
                      height: `${dims.width * 0.06}px`,
                      background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.4) 0%, rgba(69, 10, 10, 0.3) 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
                      border: '1px solid #1f2937'
                    }}
                  />
                </div>
                
                {/* Smoke from engine */}
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="absolute rounded-full animate-pulse"
                    style={{
                      width: `${8 + j * 6}px`,
                      height: `${8 + j * 6}px`,
                      background: 'radial-gradient(circle, rgba(107, 114, 128, 0.5) 0%, transparent 70%)',
                      right: `${20 + j * 8}%`,
                      top: `-${3 + j * 7}px`,
                      animationDelay: `${j * 0.25}s`,
                      filter: 'blur(2px)'
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Debris and glass shards on ground */}
            <div className="flex items-center justify-center gap-1 mb-1" style={{ opacity: dims.opacity }}>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm"
                  style={{
                    width: `${2 + Math.random() * 4}px`,
                    height: `${2 + Math.random() * 4}px`,
                    background: i % 3 === 0 ? 'rgba(186, 230, 253, 0.6)' : 'rgba(75, 85, 99, 0.5)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                />
              ))}
            </div>

            {/* Warning cones / Emergency markers */}
            <div className="flex items-center justify-center gap-2" style={{ opacity: dims.opacity }}>
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse"
                  style={{
                    width: `${8 * (dims.width / 75)}px`,
                    height: `${12 * (dims.width / 75)}px`,
                    background: 'linear-gradient(to bottom, #f97316 0%, #f97316 60%, #1f2937 60%, #1f2937 100%)',
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>

            {/* Emergency flashing lights effect - Enhanced */}
            <div 
              className="absolute inset-0 animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.2) 40%, transparent 70%)',
                opacity: dims.opacity * 0.6,
                pointerEvents: 'none',
                filter: 'blur(20px)'
              }}
            />
            
            {/* Blue light flash alternating */}
            <div 
              className="absolute inset-0 animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0.15) 40%, transparent 70%)',
                opacity: dims.opacity * 0.5,
                pointerEvents: 'none',
                animationDelay: '0.5s',
                filter: 'blur(20px)'
              }}
            />
            
            {/* Smoke/steam rising from vehicles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: dims.opacity * 0.6 }}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    width: `${15 + Math.random() * 20}px`,
                    height: `${15 + Math.random() * 20}px`,
                    background: 'radial-gradient(circle, rgba(156, 163, 175, 0.4) 0%, rgba(156, 163, 175, 0.2) 50%, transparent 100%)',
                    left: `${25 + Math.random() * 50}%`,
                    top: `${-10 + Math.random() * 30}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    filter: 'blur(4px)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      {/* Sky/Background */}
      {getSceneContent()}

      {/* Asphalt road texture */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom, 
              transparent 0%, 
              rgba(40, 40, 45, 0.5) 35%,
              rgba(35, 35, 40, 0.8) 50%, 
              rgba(30, 30, 35, 0.95) 100%
            )
          `
        }}
      >
        {scenario !== 'sensor-failure' && [...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${35 + Math.random() * 65}%`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      {/* Road lane markers */}
      <div className="absolute inset-0">
        <div className="absolute top-0 h-full overflow-hidden" style={{ left: '30%' }}>
          {[...Array(15)].map((_, i) => {
            const baseY = (roadOffset * 6 + i * 60) % 700;
            const perspective = baseY / 700;
            return (
              <div
                key={`left-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  height: `${20 + perspective * 50}px`,
                  width: `${2 + perspective * 3}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: `${100 - perspective * 100}%`,
                  opacity: 0.4 + perspective * 0.5,
                  boxShadow: '0 0 4px rgba(255,255,255,0.5)'
                }}
              />
            );
          })}
        </div>
        
        <div className="absolute top-0 h-full overflow-hidden" style={{ left: '50%' }}>
          {[...Array(15)].map((_, i) => {
            const baseY = (roadOffset * 6 + i * 60) % 700;
            const perspective = baseY / 700;
            return (
              <div
                key={`center-${i}`}
                className="absolute bg-yellow-400 rounded-full"
                style={{
                  height: `${25 + perspective * 60}px`,
                  width: `${3 + perspective * 4}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: `${100 - perspective * 100}%`,
                  opacity: 0.6 + perspective * 0.4,
                  boxShadow: '0 0 6px rgba(251, 191, 36, 0.6)'
                }}
              />
            );
          })}
        </div>
        
        <div className="absolute top-0 h-full overflow-hidden" style={{ left: '70%' }}>
          {[...Array(15)].map((_, i) => {
            const baseY = (roadOffset * 6 + i * 60) % 700;
            const perspective = baseY / 700;
            return (
              <div
                key={`right-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  height: `${20 + perspective * 50}px`,
                  width: `${2 + perspective * 3}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: `${100 - perspective * 100}%`,
                  opacity: 0.4 + perspective * 0.5,
                  boxShadow: '0 0 4px rgba(255,255,255,0.5)'
                }}
              />
            );
          })}
        </div>
        
        <div className="absolute top-0 h-full bg-white/60" style={{ left: '15%', width: '3px' }} />
        <div className="absolute top-0 h-full bg-white/60" style={{ left: '85%', width: '3px' }} />
      </div>

      {/* Other traffic cars */}
      {scenario !== 'sensor-failure' && cars.map(car => renderCar(car))}

      {/* Center lane hazard - only when urgency is high */}
      {renderCenterLaneHazard()}

      {/* OUR CAR - Fixed in center lane - positioned behind all UI elements */}
      {isActive && (
        <div 
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: '10%',
            width: '75px',
            height: '130px',
            zIndex: 0
          }}
        >
          <div className="relative w-full h-full">
            {/* Car body */}
            <div 
              className="absolute inset-0 rounded-md"
              style={{ 
                background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.3)'
              }}
            >
              {/* Windshield */}
              <div 
                className="absolute left-[15%] right-[15%] rounded-t-lg"
                style={{
                  top: '20%',
                  height: '35%',
                  background: 'linear-gradient(180deg, rgba(100, 150, 200, 0.9) 0%, rgba(60, 100, 150, 0.7) 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <div 
                  className="absolute inset-x-0 top-0 h-[40%] rounded-t-lg"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)'
                  }}
                />
              </div>

              {/* Hood detail */}
              <div 
                className="absolute left-[20%] right-[20%]"
                style={{
                  top: '55%',
                  height: '12%',
                  background: 'linear-gradient(180deg, rgba(40, 60, 80, 0.9) 0%, rgba(20, 30, 40, 0.7) 100%)',
                  border: '1px solid rgba(0,0,0,0.4)'
                }}
              />

              {/* Brake lights */}
              <div 
                className="absolute left-[12%] rounded-sm"
                style={{
                  bottom: '6%',
                  width: '22%',
                  height: '10%',
                  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  border: '1px solid rgba(0,0,0,0.5)'
                }}
              />
              
              <div 
                className="absolute right-[12%] rounded-sm"
                style={{
                  bottom: '6%',
                  width: '22%',
                  height: '10%',
                  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  border: '1px solid rgba(0,0,0,0.5)'
                }}
              />

              {/* Side mirrors */}
              <div 
                className="absolute rounded-full"
                style={{
                  top: '35%',
                  left: '-8%',
                  width: '15%',
                  height: '8%',
                  background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              />
              <div 
                className="absolute rounded-full"
                style={{
                  top: '35%',
                  right: '-8%',
                  width: '15%',
                  height: '8%',
                  background: 'linear-gradient(270deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              />

              {/* License plate */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 bg-white rounded-sm"
                style={{
                  bottom: '2%',
                  width: '35%',
                  height: '5%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9)'
                }}
              />

              {/* Shine/reflection effect */}
              <div 
                className="absolute inset-0 rounded-md pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)'
                }}
              />

              {/* Center line detail */}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-black/30" />
            </div>

            {/* Wheels */}
            <div 
              className="absolute bg-black rounded-full"
              style={{
                bottom: '8%',
                left: '15%',
                width: '18%',
                height: '12%',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9), 0 3px 6px rgba(0,0,0,0.6)'
              }}
            >
              <div className="absolute inset-1 bg-gray-600 rounded-full" />
              <div className="absolute inset-2 bg-gray-800 rounded-full" />
            </div>
            <div 
              className="absolute bg-black rounded-full"
              style={{
                bottom: '8%',
                right: '15%',
                width: '18%',
                height: '12%',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9), 0 3px 6px rgba(0,0,0,0.6)'
              }}
            >
              <div className="absolute inset-1 bg-gray-600 rounded-full" />
              <div className="absolute inset-2 bg-gray-800 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Tesla-style HUD */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 30 }}>
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 text-white/80 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Autopilot Active</span>
            </div>
          </div>
          
          <div className="bg-black/60 backdrop-blur-md rounded-lg px-3 py-2 border border-blue-400/30">
            <div className="text-center mb-1">
              <div className="text-white/60 text-[10px]">All Cars Moving Forward</div>
              <div className="text-blue-400 text-xs font-semibold">CENTER LANE</div>
            </div>
            <div className="text-white text-center">
              <div className="text-2xl tabular-nums">105</div>
              <div className="text-[10px] opacity-60">km/h</div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 left-2 w-28 h-20 bg-black/50 backdrop-blur-sm rounded border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5" />
          <div className="absolute top-1 right-1 text-white/40 text-[8px]">LEFT</div>
        </div>
        
        <div className="absolute top-1/2 -translate-y-1/2 right-2 w-28 h-20 bg-black/50 backdrop-blur-sm rounded border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/5" />
          <div className="absolute top-1 left-1 text-white/40 text-[8px]">RIGHT</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
    </div>
  );
}