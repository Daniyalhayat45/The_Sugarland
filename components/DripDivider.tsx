type DripDividerProps = {
  /** Color of the drip shape itself */
  fill?: string;
  /** Flip vertically so drips point up instead of down */
  flip?: boolean;
  className?: string;
};

/**
 * Signature brand element: a row of melting gold icing drips, echoing the
 * cake in The Sugarland logo. Used between page sections instead of a plain
 * divider line.
 */
export default function DripDivider({ fill = "#C9A227", flip = false, className = "" }: DripDividerProps) {
  return (
    <div className={`drip-divider animate ${className}`} style={flip ? { transform: "scaleY(-1)" } : undefined}>
      <svg viewBox="0 0 1200 46" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill={fill}
          d="M0,0 H1200 V10
             C1170,10 1160,34 1140,34 C1120,34 1112,12 1090,12
             C1068,12 1062,40 1038,40 C1014,40 1008,8 984,8
             C960,8 954,30 930,30 C906,30 900,14 876,14
             C852,14 848,38 822,38 C796,38 792,10 766,10
             C740,10 736,26 710,26 C684,26 682,6 656,6
             C630,6 628,32 602,32 C576,32 574,16 548,16
             C522,16 520,36 494,36 C468,36 466,10 440,10
             C414,10 412,28 386,28 C360,28 358,8 332,8
             C306,8 304,30 278,30 C252,30 250,14 224,14
             C198,14 196,34 170,34 C144,34 142,10 116,10
             C90,10 88,24 62,24 C36,24 34,4 8,4 C4,4 2,6 0,10 Z"
        />
      </svg>
    </div>
  );
}
