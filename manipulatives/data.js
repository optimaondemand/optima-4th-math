/* OAO Math Manipulatives — catalog. Tools match the Dimensions Math classroom kits for Grades 3, 4 and 5
   (singaporemath.com kit lists) plus the drawn models the books use on every page. */
window.OAOM_DATA = (function () {
  var tools = [
    /* group: number */
    { id: 'discs', g: 'Place Value', name: 'Number Discs', grades: [3, 4, 5], src: 'kit',
      kit: 'Place Value Discs (4-value in Grade 3; 10-value, decimals to whole numbers, in Grades 4 and 5)', home: 'Write 1, 10, 100 and 1,000 on paper circles or coins.',
      what: 'Build numbers with discs. Break a disc into 10 smaller ones, or trade 10 for 1 bigger one.' },
    { id: 'pvcards', g: 'Place Value', name: 'Place-Value Cards', grades: [3, 4, 5], src: 'kit',
      kit: 'Sensational Math Place Value Cards (4-value Grade 3; 10-value Grades 4 and 5)', home: 'Write 3,000 / 400 / 50 / 6 on strips of paper and stack them.',
      what: 'Pull the stacked cards apart to see what each digit is worth, then push them back together.' },
    { id: 'blocks', g: 'Place Value', name: 'Base-Ten Blocks', grades: [3, 4, 5], src: 'kit',
      kit: 'Base Ten Units, Rods, Flats and Thousand Cube', home: 'Draw dots, sticks and squares on paper.',
      what: 'Ones, tens, hundreds and thousands you can break apart and group.' },
    { id: 'bond', g: 'Models', name: 'Number Bond', grades: [3, 4, 5], src: 'model',
      kit: 'Drawn in the textbook and workbook', home: 'Draw a circle for the whole and circles for the parts.',
      what: 'Split a whole into parts, or put parts together to make the whole.' },
    { id: 'bar', g: 'Models', name: 'Bar Model', grades: [3, 4, 5], src: 'model',
      kit: 'Drawn in the textbook and workbook', home: 'Draw bars on paper or a dry-erase sleeve.',
      what: 'Draw a word problem with bars so you can see what you know and what you need to find.' },
    { id: 'numberline', g: 'Models', name: 'Number Line', grades: [3, 4, 5], src: 'model',
      kit: 'Folding Meter/Yard Stick works as a number line', home: 'Draw a line and mark equal jumps.',
      what: 'Mark whole numbers, fractions or decimals on a line and show hops between them.' },
    { id: 'counters', g: 'Operations', name: 'Counters & Arrays', grades: [3, 4, 5], src: 'kit',
      kit: 'Two-Color Counters (red/yellow)', home: 'Beans, buttons or cereal pieces.',
      what: 'Make rows and columns to multiply, or share counters into equal groups to divide.' },
    { id: 'hundred', g: 'Operations', name: 'Hundred Chart & Times Table', grades: [3, 4, 5], src: 'kit',
      kit: 'Hundred Number Board', home: 'Print the blank chart from this page.',
      what: 'Skip-count, find multiples and factors, and spot patterns.' },
    { id: 'dice', g: 'Operations', name: 'Dice & Number Cards', grades: [3, 4, 5], src: 'kit',
      kit: '10-Sided Dice (0–9), Blank Dice, playing cards and fact cards', home: 'A deck of playing cards (face cards out).',
      what: 'Roll dice or flip digit cards to make numbers and play practice games.' },
    /* group: fractions + decimals */
    { id: 'fbars', g: 'Fractions & Decimals', name: 'Fraction Tiles', grades: [3, 4, 5], src: 'kit',
      kit: 'Fraction Tiles with Tray (numbered)', home: 'Fold and cut paper strips the same length.',
      what: 'Stack fraction tiles under one whole to compare, find equal fractions and add.' },
    { id: 'fcircles', g: 'Fractions & Decimals', name: 'Fraction Circles', grades: [3, 4, 5], src: 'kit',
      kit: 'Fraction Circles (Grades 4 and 5 supply list)', home: 'Paper plates cut into equal slices.',
      what: 'Shade slices of circles to show fractions and mixed numbers.' },
    { id: 'decgrid', g: 'Fractions & Decimals', name: 'Decimal Grid', grades: [4, 5], src: 'model',
      kit: 'Centimeter Grid Dry-Erase Board (a 10 by 10 square)', home: 'Draw a 10 by 10 square on grid paper.',
      what: 'Shade tenths and hundredths to see decimals, fractions and percents.' },
    { id: 'money', g: 'Fractions & Decimals', name: 'Coins & Bills', grades: [3, 4, 5], src: 'kit',
      kit: 'Classroom Money Kit / Magnetic Money Set', home: 'Real coins from a jar.',
      what: 'Count money, make amounts and make change.' },
    /* group: measurement */
    { id: 'ruler', g: 'Measurement', name: 'Rulers & Measuring Tape', grades: [3, 4, 5], src: 'kit',
      kit: '12-inch rulers, English/Metric Tape Measure, Folding Meter/Yard Stick', home: 'Any ruler or tape measure.',
      what: 'Measure in centimeters, meters, inches, feet and yards.' },
    { id: 'scale', g: 'Measurement', name: 'Scale & Balance', grades: [3, 4, 5], src: 'kit',
      kit: 'Platform Scale (5 kg / 11 lb), Metric Weights, Balance', home: 'A kitchen or bathroom scale.',
      what: 'Read a scale dial and balance weights in grams, kilograms, ounces and pounds.' },
    { id: 'beaker', g: 'Measurement', name: 'Beakers & Measuring Cups', grades: [3, 4, 5], src: 'kit',
      kit: 'Metric Beakers, Liquid Measuring Set, Liter Cube', home: 'Kitchen measuring cups and a water bottle.',
      what: 'Fill and read beakers in milliliters and liters, or cups, pints, quarts and gallons.' },
    { id: 'clock', g: 'Measurement', name: 'Clock & Timer', grades: [3, 4, 5], src: 'kit',
      kit: 'Demonstration Clock, Student Clocks, Digital Timer', home: 'A clock with hands, or a paper-plate clock.',
      what: 'Move the hands to tell time and find how much time has passed.' },
    /* group: geometry */
    { id: 'tiles', g: 'Geometry', name: 'Color Tiles & Area Grid', grades: [3, 4, 5], src: 'kit',
      kit: 'Color Tiles, Centimeter Grid Dry-Erase Board', home: 'Squares cut from sticky notes.',
      what: 'Lay square tiles to find area and walk the edges to find perimeter.' },
    { id: 'geoboard', g: 'Geometry', name: 'Geoboard', grades: [3, 4, 5], src: 'kit',
      kit: '11 by 11 Pin Grid Geoboard', home: 'Dot paper and a pencil.',
      what: 'Stretch bands between pins to make lines, angles and shapes.' },
    { id: 'whiteboard', g: 'Geometry', name: 'Grid Whiteboard', grades: [3, 4, 5], src: 'kit',
      kit: 'Centimeter Grid Dry-Erase Boards and SmartPAL Dry-Erase Sleeves', home: 'Grid paper in a page protector.',
      what: 'Draw, write and show your work on grid, dot or blank paper.' },
    { id: 'tangram', g: 'Geometry', name: 'Tangrams', grades: [3, 4], src: 'kit',
      kit: 'Tangrams', home: 'Cut a paper square into the seven pieces.',
      what: 'Slide, turn and flip seven pieces to build shapes and pictures.' },
    { id: 'pattern', g: 'Geometry', name: 'Pattern Blocks', grades: [3, 4, 5], src: 'kit',
      kit: 'Pattern Blocks', home: 'Print and cut the shapes.',
      what: 'Build designs, find lines of symmetry and see fractions of a hexagon.' },
    { id: 'protractor', g: 'Geometry', name: 'Protractor', grades: [4, 5], src: 'kit',
      kit: '4-inch Clear Protractor', home: 'A paper protractor (print this page).',
      what: 'Move the arms to make an angle and read its size in degrees.' },
    { id: 'setsquare', g: 'Geometry', name: 'Set Squares & Ruler', grades: [3, 4, 5], src: 'kit',
      kit: 'Triangle Ruler Set (30°/60° and 45°/90°)', home: 'The corner of a sheet of paper is a right angle.',
      what: 'Slide and turn triangle rulers to draw perpendicular and parallel lines.' },
    { id: 'compass', g: 'Geometry', name: 'Compass', grades: [3, 4, 5], src: 'kit',
      kit: 'Plastic Safety Compass', home: 'A pencil tied to a string with a pushpin.',
      what: 'Set the radius and swing the pencil to draw circles.' },
    { id: 'trademat', g: 'Measurement', name: 'Trade Mat', grades: [3, 4, 5], src: 'model',
      kit: 'Place Value Discs used as “big” and “small” units, like the kit’s disc mat', home: 'Two kinds of coins or buttons: one kind is the big unit, the other the small unit.',
      what: 'Add and take away amounts with two units, like feet and inches, trading 1 big for 12, 16 or 100 small.' },
    { id: 'barstrip', g: 'Measurement', name: 'Bar Strip', grades: [3, 4, 5], src: 'model',
      kit: 'Fraction Tiles and a Folding Meter/Yard Stick', home: 'Paper strips cut to the same length.',
      what: 'Fill one long bar with smaller pieces to see how many fit, or compare two amounts on the same scale.' },
    { id: 'cubes', g: 'Geometry', name: 'Unit Cubes', grades: [4, 5], src: 'kit',
      kit: 'Centimeter Cubes, Linking Cubes, Liter Cube', home: 'Sugar cubes or small blocks.',
      what: 'Stack cubes to build boxes and find volume.' }
  ];
  var groups = ['Place Value', 'Models', 'Operations', 'Fractions & Decimals', 'Measurement', 'Geometry'];
  /* lesson links: G4 lives beside this folder; G3 and G5 are the sister repos on GitHub Pages */
  var base = { 3: 'https://optimaondemand.github.io/optima-3rd-math/', 4: '../', 5: 'https://optimaondemand.github.io/optima-5th-math/' };
  var units = {}; var lessons = [];
  var LESSONS = [["3.01.01", "Place Value Part 1", "math-lesson-3-01-01-place-value-part-1.html"], ["3.01.02", "Place Value Part 2", "math-lesson-3-01-02-place-value-part-2.html"], ["3.01.03", "Comparing Numbers", "math-lesson-3-01-03-comparing-numbers.html"], ["3.01.04", "The Number Line", "math-lesson-3-01-04-the-number-line.html"], ["3.01.05", "Number Patterns", "math-lesson-3-01-05-number-patterns.html"], ["3.01.06", "Rounding to the Nearest Thousand", "math-lesson-3-01-06-rounding-to-the-nearest-thousand.html"], ["3.01.07", "Rounding to the Nearest Hundred", "math-lesson-3-01-07-rounding-to-the-nearest-hundred.html"], ["3.01.08", "Rounding to the Nearest Ten", "math-lesson-3-01-08-rounding-to-the-nearest-ten.html"], ["3.02.01", "Mental Addition Part 1", "math-lesson-3-02-01-mental-addition-part-1.html"], ["3.02.02", "Mental Addition Part 2", "math-lesson-3-02-02-mental-addition-part-2.html"], ["3.02.03", "Mental Subtraction Part 1", "math-lesson-3-02-03-mental-subtraction-part-1.html"], ["3.02.04", "Mental Subtraction Part 2", "math-lesson-3-02-04-mental-subtraction-part-2.html"], ["3.02.05", "Making 100 and 1,000", "math-lesson-3-02-05-making-100-and-1000.html"], ["3.02.06", "Numbers Close to Hundreds", "math-lesson-3-02-06-numbers-close-to-hundreds.html"], ["3.02.07", "Sum and Difference", "math-lesson-3-02-07-sum-and-difference.html"], ["3.02.08", "Word Problems Part 1", "math-lesson-3-02-08-word-problems-part-1.html"], ["3.02.09", "Word Problems Part 2", "math-lesson-3-02-09-word-problems-part-2.html"], ["3.02.10", "Two Step Word Problems", "math-lesson-3-02-10-two-step-word-problems.html"], ["3.03.01", "Addition with Regrouping", "math-lesson-3-03-01-addition-with-regrouping.html"], ["3.03.02", "Subtraction with Regrouping Part 1", "math-lesson-3-03-02-subtraction-with-regrouping-part-1.html"], ["3.03.03", "Subtraction with Regrouping Part 2", "math-lesson-3-03-03-subtraction-with-regrouping-part-2.html"], ["3.03.04", "Estimating Sums and Differences Part 1", "math-lesson-3-03-04-estimating-sums-and-differences-part-1.html"], ["3.03.05", "Estimating Sums and Differences Part 2", "math-lesson-3-03-05-estimating-sums-and-differences-part-2.html"], ["3.03.06", "Word Problems", "math-lesson-3-03-06-word-problems.html"], ["3.04.01", "Looking Back At Multiplication", "math-lesson-3-04-01-looking-back-at-multiplication.html"], ["3.04.02", "Strategies For Finding the Product", "math-lesson-3-04-02-strategies-for-finding-the-product.html"], ["3.04.03", "Looking Back At Division", "math-lesson-3-04-03-looking-back-at-division.html"], ["3.04.04", "Multiplying and Dividing with 0 and 1", "math-lesson-3-04-04-multiplying-and-dividing-with-0-and-1.html"], ["3.04.05", "Division with Remainders", "math-lesson-3-04-05-division-with-remainders.html"], ["3.04.06", "Odd and Even Numbers", "math-lesson-3-04-06-odd-and-even-numbers.html"], ["3.04.07", "Word Problems Part 1", "math-lesson-3-04-07-word-problems-part-1.html"], ["3.04.08", "Word Problems Part 2", "math-lesson-3-04-08-word-problems-part-2.html"], ["3.04.09", "Two Step Word Problems", "math-lesson-3-04-09-two-step-word-problems.html"], ["3.05.01", "Multiplying Ones, Tens and Hundreds", "math-lesson-3-05-01-multiplying-ones-tens-and-hundreds.html"], ["3.05.02", "Multiplication Without Regrouping", "math-lesson-3-05-02-multiplication-without-regrouping.html"], ["3.05.03", "Multiplication with Regrouping Tens", "math-lesson-3-05-03-multiplication-with-regrouping-tens.html"], ["3.05.04", "Multiplication with Regrouping Ones", "math-lesson-3-05-04-multiplication-with-regrouping-ones.html"], ["3.05.05", "Multiplication with Regrouping Ones and Tens", "math-lesson-3-05-05-multiplication-with-regrouping-ones-and-tens.html"], ["3.05.06", "Three-Digit Multiplication One Regrouping", "math-lesson-3-05-06-three-digit-multiplication-one-regrouping.html"], ["3.05.07", "Multiplication with Multiple Regroupings", "math-lesson-3-05-07-multiplication-with-multiple-regroupings.html"], ["3.06.01", "Dividing Tens and Hundreds", "math-lesson-3-06-01-dividing-tens-and-hundreds.html"], ["3.06.02", "Dividing 2-Digit by 2 Part 1", "math-lesson-3-06-02-dividing-2-digit-by-2-part-1.html"], ["3.06.03", "Dividing 2-Digit by 2 Part 2", "math-lesson-3-06-03-dividing-2-digit-by-2-part-2.html"], ["3.06.04", "Dividing 2-Digit by 3, 4 and 5", "math-lesson-3-06-04-dividing-2-digit-by-3-4-and-5.html"], ["3.06.05", "Dividing 3-Digit by 2", "math-lesson-3-06-05-dividing-3-digit-by-2.html"], ["3.06.06", "Dividing 3-Digit by 3, 4 and 5", "math-lesson-3-06-06-dividing-3-digit-by-3-4-and-5.html"], ["3.06.07", "Three-Digit Quotients and 2-Digit Divisors", "math-lesson-3-06-07-three-digit-quotient-2-digits.html"], ["3.07.01", "Picture Graphs and Bar Graphs", "math-lesson-3-07-01-picture-graphs-and-bar-graphs.html"], ["3.07.02", "Bar Graphs and Tables", "math-lesson-3-07-02-bar-graphs-and-tables.html"], ["3.08.01", "Multiplication Table of 6", "math-lesson-3-08-01-multiplication-table-of-6.html"], ["3.08.02", "Multiplication Table of 7", "math-lesson-3-08-02-multiplication-table-of-7.html"], ["3.08.03", "Multiplying by 6 and 7", "math-lesson-3-08-03-multiplying-by-6-and-7.html"], ["3.08.04", "Dividing by 6 and 7", "math-lesson-3-08-04-dividing-by-6-and-7.html"], ["3.08.05", "Multiplication Table of 8", "math-lesson-3-08-05-multiplication-table-of-8.html"], ["3.08.06", "Multiplication Table of 9", "math-lesson-3-08-06-multiplication-table-of-9.html"], ["3.08.07", "Multiplying by 8 and 9", "math-lesson-3-08-07-multiplying-by-8-and-9.html"], ["3.09.01", "Fractions of a Whole", "math-lesson-3-09-01-fractions-of-a-whole.html"], ["3.09.02", "Fractions on a Number Line", "math-lesson-3-09-02-fractions-on-a-number-line.html"], ["3.09.03", "Comparing Fractions Like Denominators", "math-lesson-3-09-03-comparing-fractions-like-denominators.html"], ["3.09.04", "Comparing Fractions Like Numerators", "math-lesson-3-09-04-comparing-fractions-like-numerators.html"], ["3.10.01", "Equivalent Fractions", "math-lesson-3-10-01-equivalent-fractions.html"], ["3.10.02", "Finding Equivalent Fractions", "math-lesson-3-10-02-finding-equivalent-fractions.html"], ["3.10.03", "Simplifying Fractions", "math-lesson-3-10-03-simplifying-fractions.html"], ["3.10.04", "Comparing Fractions Part 1", "math-lesson-3-10-04-comparing-fractions-part-1.html"], ["3.10.05", "Comparing Fractions Part 2", "math-lesson-3-10-05-comparing-fractions-part-2.html"], ["3.10.06", "Adding and Subtracting Fractions Part 1", "math-lesson-3-10-06-adding-subtracting-fractions-part-1.html"], ["3.10.07", "Adding and Subtracting Fractions Part 2", "math-lesson-3-10-07-adding-subtracting-fractions-part-2.html"], ["3.11.01", "Meters and Centimeters", "math-lesson-3-11-01-meters-and-centimeters.html"], ["3.11.02", "Subtracting from Meters", "math-lesson-3-11-02-subtracting-from-meters.html"], ["3.11.03", "Kilometers", "math-lesson-3-11-03-kilometers.html"], ["3.11.04", "Subtracting from Kilometers", "math-lesson-3-11-04-subtracting-from-kilometers.html"], ["3.11.05", "Liters and Milliliters", "math-lesson-3-11-05-liters-and-milliliters.html"], ["3.11.06", "Kilograms and Grams", "math-lesson-3-11-06-kilograms-and-grams.html"], ["3.11.07", "Word Problems", "math-lesson-3-11-07-word-problems.html"], ["3.12.01", "Circles", "math-lesson-3-12-01-circles.html"], ["3.12.02", "Angles", "math-lesson-3-12-02-angles.html"], ["3.12.03", "Right Angles", "math-lesson-3-12-03-right-angles.html"], ["3.12.04", "Triangles", "math-lesson-3-12-04-triangles.html"], ["3.12.05", "Properties of Triangles", "math-lesson-3-12-05-properties-of-triangles.html"], ["3.12.06", "Properties of Quadrilaterals", "math-lesson-3-12-06-properties-of-quadrilaterals.html"], ["3.12.07", "Using a Compass", "math-lesson-3-12-07-using-a-compass.html"], ["4.01.01", "Numbers to 100,000", "math-lesson-4-01-01-numbers-to-100000.html"], ["4.01.02", "Numbers to 1,000,000", "math-lesson-4-01-02-numbers-to-1000000.html"], ["4.01.03", "Number Patterns", "math-lesson-4-01-03-number-patterns.html"], ["4.01.04", "Comparing and Ordering Numbers", "math-lesson-4-01-04-comparing-and-ordering-numbers.html"], ["4.01.05", "Rounding 5-Digit Numbers", "math-lesson-4-01-05-rounding-5-digit-numbers.html"], ["4.01.06", "Rounding 6-Digit Numbers", "math-lesson-4-01-06-rounding-6-digit-numbers.html"], ["4.01.07", "Calculations and Place Value", "math-lesson-4-01-07-calculations-and-place-value.html"], ["4.02.01", "Addition", "math-lesson-4-02-01-addition.html"], ["4.02.02", "Subtraction", "math-lesson-4-02-02-subtraction.html"], ["4.02.03", "Other Ways to Add and Subtract Part 1", "math-lesson-4-02-03-other-ways-add-subtract-pt1.html"], ["4.02.04", "Other Ways to Add and Subtract Part 2", "math-lesson-4-02-04-other-ways-add-subtract-pt2.html"], ["4.02.05", "Word Problems", "math-lesson-4-02-05-word-problems.html"], ["4.03.01", "Multiples", "math-lesson-4-03-01-multiples.html"], ["4.03.02", "Common Multiples", "math-lesson-4-03-02-common-multiples.html"], ["4.03.03", "Factors", "math-lesson-4-03-03-factors.html"], ["4.03.04", "Prime and Composite", "math-lesson-4-03-04-prime-and-composite.html"], ["4.03.05", "Common Factors", "math-lesson-4-03-05-common-factors.html"], ["4.04.01", "Mental Math Multiplication", "math-lesson-4-04-01-mental-math-multiplication.html"], ["4.04.02", "Multiplying by a 1-Digit Number Part 1", "math-lesson-4-04-02-multiplying-1-digit-pt1.html"], ["4.04.03", "Multiplying by a 1-Digit Number Part 2", "math-lesson-4-04-03-multiplying-1-digit-pt2.html"], ["4.04.04", "Multiplying by a Multiple of 10", "math-lesson-4-04-04-multiplying-by-multiple-of-10.html"], ["4.04.05", "Multiplying by a 2-Digit Number Part 1", "math-lesson-4-04-05-multiplying-by-2-digit-pt1.html"], ["4.04.06", "Multiplying by a 2-Digit Number Part 2", "math-lesson-4-04-06-multiplying-by-2-digit-pt2.html"], ["4.05.01", "Mental Math Division", "math-lesson-4-05-01-mental-math-division.html"], ["4.05.02", "Estimation and Division", "math-lesson-4-05-02-estimation-division.html"], ["4.05.03", "Dividing 4-Digit Numbers", "math-lesson-4-05-03-dividing-4-digit.html"], ["4.05.04", "Division Word Problems", "math-lesson-4-05-04-division-word-problems.html"], ["4.06.01", "Equivalent Fractions", "math-lesson-4-06-01-equivalent-fractions.html"], ["4.06.02", "Comparing and Ordering Fractions", "math-lesson-4-06-02-comparing-ordering-fractions.html"], ["4.06.03", "Improper Fractions and Mixed Numbers", "math-lesson-4-06-03-improper-and-mixed.html"], ["4.06.04", "Improper Fractions to Mixed Numbers", "math-lesson-4-06-04-improper-to-mixed.html"], ["4.06.05", "Mixed Numbers to Improper Fractions", "math-lesson-4-06-05-mixed-to-improper.html"], ["4.06.06", "Fractions and Division", "math-lesson-4-06-06-fractions-and-division.html"], ["4.07.01", "Adding and Subtracting Fractions", "math-lesson-4-07-01-add-subtract-fractions.html"], ["4.07.02", "Adding and Subtracting with Different Denominators", "math-lesson-4-07-02-add-subtract-different-denom.html"], ["4.07.03", "Adding a Fraction to a Mixed Number", "math-lesson-4-07-03-mixed-plus-fraction.html"], ["4.07.04", "Adding Mixed Numbers", "math-lesson-4-07-04-adding-mixed-numbers.html"], ["4.07.05", "Subtracting a Fraction from a Mixed Number", "math-lesson-4-07-05-subtract-fraction-from-mixed.html"], ["4.07.06", "Subtracting Mixed Numbers", "math-lesson-4-07-06-subtracting-mixed-numbers.html"], ["4.08.01", "Unit Fraction Times a Whole Number", "math-lesson-4-08-01-unit-fraction-times-whole.html"], ["4.08.02", "Fraction Times a Whole Number Part 1", "math-lesson-4-08-02-fraction-times-whole-pt1.html"], ["4.08.03", "Fraction Times a Whole Number Part 2", "math-lesson-4-08-03-fraction-times-whole-pt2.html"], ["4.08.04", "Fraction of a Set", "math-lesson-4-08-04-fraction-of-a-set.html"], ["4.08.05", "Whole Number Times a Fraction Part 1", "math-lesson-4-08-05-whole-times-fraction-pt1.html"], ["4.08.06", "Whole Number Times a Fraction Part 2", "math-lesson-4-08-06-whole-times-fraction-pt2.html"], ["4.08.07", "Word Problems", "math-lesson-4-08-07-word-problems.html"], ["4.08.08", "Word Problems Part 2", "math-lesson-4-08-08-word-problems-pt2.html"], ["4.09.01", "Mode, Median and Range", "math-lesson-4-09-01-mode-median-range.html"], ["4.09.02", "Line Plots", "math-lesson-4-09-02-line-plots.html"], ["4.09.03", "Stem-and-Leaf Plots", "math-lesson-4-09-03-stem-and-leaf.html"], ["4.09.04", "Data Word Problems", "math-lesson-4-09-04-data-word-problems.html"], ["4.09.05", "Line Graphs", "math-lesson-4-09-05-line-graphs.html"], ["4.09.06", "Drawing Line Graphs", "math-lesson-4-09-06-drawing-line-graphs.html"], ["4.10.01", "Metric Units", "math-lesson-4-10-01-metric-units.html"], ["4.10.02", "Customary Length", "math-lesson-4-10-02-customary-length.html"], ["4.10.03", "Customary Weight", "math-lesson-4-10-03-customary-weight.html"], ["4.10.04", "Customary Capacity", "math-lesson-4-10-04-customary-capacity.html"], ["4.10.05", "Units of Time", "math-lesson-4-10-05-units-of-time.html"], ["4.10.06", "Fractions and Measurement", "math-lesson-4-10-06-fractions-and-measurement.html"], ["4.10.07", "Fractions and Measurement Part 2", "math-lesson-4-10-07-fractions-and-measurement-pt-2.html"], ["4.11.01", "Area of Rectangles Part 1", "math-lesson-4-11-01-area-of-rectangles-pt-1.html"], ["4.11.02", "Area of Rectangles Part 2", "math-lesson-4-11-02-area-of-rectangles-pt-2.html"], ["4.11.03", "Area of Composite Figures", "math-lesson-4-11-03-area-of-composite-figures.html"], ["4.11.04", "Perimeter Part 1", "math-lesson-4-11-04-perimeter-pt-1.html"], ["4.11.05", "Perimeter Part 2", "math-lesson-4-11-05-perimeter-pt-2.html"], ["4.12.01", "Tenths Part 1", "math-lesson-4-12-01-tenths-pt-1_v2.html"], ["4.12.02", "Tenths Part 2", "math-lesson-4-12-02-tenths-pt-2_v2.html"], ["4.12.03", "Hundredths Part 1", "math-lesson-4-12-03-hundredths-pt-1_v2.html"], ["4.12.04", "Hundredths Part 2", "math-lesson-4-12-04-hundredths-pt-2_v2.html"], ["4.12.05", "Decimals to Fractions", "math-lesson-4-12-05-decimals-to-fractions_v2.html"], ["4.12.06", "Fractions to Decimals", "math-lesson-4-12-06-fractions-to-decimals_v2.html"], ["4.12.07", "Comparing Decimals", "math-lesson-4-12-07-comparing-decimals_v2.html"], ["4.12.08", "Rounding Decimals", "math-lesson-4-12-08-rounding-decimals_v2.html"], ["4.13.01", "Adding and Subtracting Tenths", "math-lesson-4-13-01-adding-subtracting-tenths.html"], ["4.13.02", "Adding Tenths with Regrouping", "math-lesson-4-13-02-adding-tenths-regrouping.html"], ["4.13.03", "Subtracting Tenths with Regrouping", "math-lesson-4-13-03-subtracting-tenths-regrouping.html"], ["4.13.04", "Adding Hundredths", "math-lesson-4-13-04-adding-hundredths.html"], ["4.13.05", "Subtracting from 1 and 0.1", "math-lesson-4-13-05-subtracting-from-1-and-0-1.html"], ["4.13.06", "Subtracting Hundredths", "math-lesson-4-13-06-subtracting-hundredths.html"], ["4.13.07", "Money, Decimals and Fractions", "math-lesson-4-13-07-money-decimals-fractions.html"], ["4.14.01", "Multiplying Tenths and Hundredths", "math-lesson-4-14-01-multiplying-tenths-hundredths.html"], ["4.14.02", "Multiplying Decimals Whole Number Part 1", "math-lesson-4-14-02-multiplying-decimals-whole-number-1.html"], ["4.14.03", "Multiplying Decimals Whole Number Part 2", "math-lesson-4-14-03-multiplying-decimals-whole-number-2.html"], ["4.14.04", "Dividing Tenths and Hundredths", "math-lesson-4-14-04-dividing-tenths-hundredths.html"], ["4.14.05", "Dividing Decimals Whole Number Part 1", "math-lesson-4-14-05-dividing-decimals-whole-number-1.html"], ["4.14.06", "Dividing Decimals Whole Number Part 2", "math-lesson-4-14-06-dividing-decimals-whole-number-2.html"], ["4.14.07", "Dividing Decimals Whole Number Part 3", "math-lesson-4-14-07-dividing-decimals-whole-number-3.html"], ["4.15.01", "Size of Angles", "math-lesson-4-15-01-size-of-angles.html"], ["4.15.02", "Measuring Angles", "math-lesson-4-15-02-measuring-angles.html"], ["4.15.03", "Drawing Angles", "math-lesson-4-15-03-drawing-angles.html"], ["4.15.04", "Adding and Subtracting Angles", "math-lesson-4-15-04-adding-subtracting-angles.html"], ["4.15.05", "Reflex Angles", "math-lesson-4-15-05-reflex-angles.html"], ["4.16.01", "Perpendicular Lines", "math-lesson-4-16-01-perpendicular-lines.html"], ["4.16.02", "Parallel Lines", "math-lesson-4-16-02-parallel-lines.html"], ["4.16.03", "Drawing Perpendicular and Parallel Lines", "math-lesson-4-16-03-drawing-perpendicular-parallel.html"], ["4.16.04", "Quadrilaterals", "math-lesson-4-16-04-quadrilaterals.html"], ["4.16.05", "Lines of Symmetry", "math-lesson-4-16-05-lines-of-symmetry.html"], ["4.16.06", "Symmetrical Figures and Patterns", "math-lesson-4-16-06-symmetrical-figures-patterns.html"], ["4.17.01", "Cuboids", "math-lesson-4-17-01-cuboids.html"], ["4.17.02", "Nets of Cuboids", "math-lesson-4-17-02-nets-of-cuboids.html"], ["4.17.03", "Faces and Edges of Cuboids", "math-lesson-4-17-03-faces-edges-of-cuboids.html"], ["5.01.01", "Multiplying by 10, 100 and 1,000", "math-lesson-5-01-01-multiplying-by-10-100-1000.html"], ["5.01.02", "Dividing by 10, 100 and 1,000", "math-lesson-5-01-02-dividing-by-10-100-1000.html"], ["5.01.03", "Multiplying by Tens, Hundreds and Thousands", "math-lesson-5-01-03-multiplying-by-tens-hundreds-thousands.html"], ["5.01.04", "Dividing by Tens, Hundreds and Thousands", "math-lesson-5-01-04-dividing-by-tens-hundreds-thousands.html"], ["5.02.01", "Expressions with Parentheses", "math-lesson-5-02-01-expressions-with-parentheses.html"], ["5.02.02", "Order of Operations Part 1", "math-lesson-5-02-02-order-of-operations-part-1.html"], ["5.02.03", "Order of Operations Part 2", "math-lesson-5-02-03-order-of-operations-part-2.html"], ["5.02.04", "Other Ways to Write and Evaluate Expressions", "math-lesson-5-02-04-other-ways-to-write-and-evaluate-expressions.html"], ["5.02.05", "Word Problems Part 1", "math-lesson-5-02-05-word-problems-part-1.html"], ["5.02.06", "Word Problems Part 2", "math-lesson-5-02-06-word-problems-part-2.html"], ["5.03.01", "Multiplying by a 2-Digit Number Part 1", "math-lesson-5-03-01-multiplying-by-a-2-digit-number-part-1.html"], ["5.03.02", "Multiplying by a 2-Digit Number Part 2", "math-lesson-5-03-02-multiplying-by-a-2-digit-number-part-2.html"], ["5.03.03", "Dividing by a Multiple of Ten", "math-lesson-5-03-03-dividing-by-a-multiple-of-ten.html"], ["5.03.04", "Divide a 2-Digit Number by a 2-Digit Number", "math-lesson-5-03-04-divide-a-2-digit-number-by-a-2-digit-number.html"], ["5.03.05", "Divide a 3-Digit Number by a 2-Digit Number Part 1", "math-lesson-5-03-05-divide-a-3-digit-number-by-a-2-digit-number-part-1.html"], ["5.03.06", "Divide a 3-Digit Number by a 2-Digit Number Part 2", "math-lesson-5-03-06-divide-a-3-digit-number-by-a-2-digit-number-part-2.html"], ["5.03.07", "Divide a 4-Digit Number by a 2-Digit Number", "math-lesson-5-03-07-divide-a-4-digit-number-by-a-2-digit-number.html"], ["5.04.01", "Fractions and Division", "math-lesson-5-04-01-fractions-and-division.html"], ["5.04.02", "Adding Unlike Fractions", "math-lesson-5-04-02-adding-unlike-fractions.html"], ["5.04.03", "Subtracting Unlike Fractions", "math-lesson-5-04-03-subtracting-unlike-fractions.html"], ["5.04.04", "Adding Mixed Numbers Part 1", "math-lesson-5-04-04-adding-mixed-numbers-part-1.html"], ["5.04.05", "Adding Mixed Numbers Part 2", "math-lesson-5-04-05-adding-mixed-numbers-part-2.html"], ["5.04.06", "Subtracting Mixed Numbers Part 1", "math-lesson-5-04-06-subtracting-mixed-numbers-part-1.html"], ["5.04.07", "Subtracting Mixed Numbers Part 2", "math-lesson-5-04-07-subtracting-mixed-numbers-part-2.html"], ["5.05.01", "Multiplying a Fraction by a Whole Number", "math-lesson-5-05-01-multiplying-a-fraction-by-a-whole-number.html"], ["5.05.02", "Multiplying a Whole Number by a Fraction", "math-lesson-5-05-02-multiplying-a-whole-number-by-a-fraction.html"], ["5.05.03", "Word Problems Part 1", "math-lesson-5-05-03-word-problems-part-1.html"], ["5.05.04", "Multiplying a Fraction by a Unit Fraction", "math-lesson-5-05-04-multiplying-a-fraction-by-a-unit-fraction.html"], ["5.05.05", "Fraction × Fraction Part 1", "math-lesson-5-05-05-fraction-x-fraction-part-1.html"], ["5.05.06", "Fraction × Fraction Part 2", "math-lesson-5-05-06-fraction-x-fraction-part-2.html"], ["5.05.07", "Multiplying Mixed Numbers", "math-lesson-5-05-07-multiplying-mixed-numbers.html"], ["5.05.08", "Word Problems Part 2", "math-lesson-5-05-08-word-problems-part-2.html"], ["5.05.09", "Fractions and Reciprocals", "math-lesson-5-05-09-fractions-and-reciprocals.html"], ["5.06.01", "Dividing a Unit Fraction by a Whole Number", "math-lesson-5-06-01-dividing-a-unit-fraction-by-a-whole-number.html"], ["5.06.02", "Dividing a Fraction by a Whole Number", "math-lesson-5-06-02-dividing-a-fraction-by-a-whole-number.html"], ["5.06.03", "Dividing a Whole Number by a Unit Fraction", "math-lesson-5-06-03-dividing-a-whole-number-by-a-unit-fraction.html"], ["5.06.04", "Dividing a Whole Number by a Fraction", "math-lesson-5-06-04-dividing-a-whole-number-by-a-fraction.html"], ["5.06.05", "Word Problems", "math-lesson-5-06-05-word-problems.html"], ["5.07.01", "Fractions and Measurement Conversions", "math-lesson-5-07-01-fractions-and-measurement-conversions.html"], ["5.07.02", "Fractions and Area", "math-lesson-5-07-02-fractions-and-area.html"], ["5.07.03", "Area of a Triangle Part 1", "math-lesson-5-07-03-area-of-a-triangle-part-1.html"], ["5.07.04", "Area of a Triangle Part 2", "math-lesson-5-07-04-area-of-a-triangle-part-2.html"], ["5.07.05", "Area of Complex Figures", "math-lesson-5-07-05-area-of-complex-figures.html"], ["5.08.01", "Cubic Units", "math-lesson-5-08-01-cubic-units.html"], ["5.08.02", "Volume of Cuboids", "math-lesson-5-08-02-volume-of-cuboids.html"], ["5.08.03", "Finding the Length of An Edge", "math-lesson-5-08-03-finding-the-length-of-an-edge.html"], ["5.08.04", "Volume of Complex Shapes", "math-lesson-5-08-04-volume-of-complex-shapes.html"], ["5.08.05", "Volume and Capacity Part 1", "math-lesson-5-08-05-volume-and-capacity-part-1.html"], ["5.08.06", "Volume and Capacity Part 2", "math-lesson-5-08-06-volume-and-capacity-part-2.html"], ["5.09.01", "Thousandths", "math-lesson-5-09-01-thousandths.html"], ["5.09.02", "Place Value to Thousandths", "math-lesson-5-09-02-place-value-to-thousandths.html"], ["5.09.03", "Comparing Decimals", "math-lesson-5-09-03-comparing-decimals.html"], ["5.09.04", "Rounding Decimals", "math-lesson-5-09-04-rounding-decimals.html"], ["5.09.05", "Multiplying Decimals by 10, 100 and 1,000", "math-lesson-5-09-05-multiplying-decimals-by-10-100-and-1-000.html"], ["5.09.06", "Dividing Decimals by 10, 100 and 1,000", "math-lesson-5-09-06-dividing-decimals-by-10-100-and-1-000.html"], ["5.09.07", "Conversion of Measures", "math-lesson-5-09-07-conversion-of-measures.html"], ["5.09.08", "Mental Calculations", "math-lesson-5-09-08-mental-calculations.html"], ["5.10.01", "Adding Decimals to the Thousandths", "math-lesson-5-10-01-adding-decimals-to-the-thousandths.html"], ["5.10.02", "Subtracting Decimals", "math-lesson-5-10-02-subtracting-decimals.html"], ["5.10.03", "Multiplying by 0.1 or 0.01", "math-lesson-5-10-03-multiplying-by-0-1-or-0-01.html"], ["5.10.04", "Multiplying by a Decimal", "math-lesson-5-10-04-multiplying-by-a-decimal.html"], ["5.10.05", "Dividing by a Whole Number Part 1", "math-lesson-5-10-05-dividing-by-a-whole-number-part-1.html"], ["5.10.06", "Dividing by a Whole Number Part 2", "math-lesson-5-10-06-dividing-by-a-whole-number-part-2.html"], ["5.10.07", "Dividing a Whole Number by 0.1 and 0.01", "math-lesson-5-10-07-dividing-a-whole-number-by-0-1-and-0-01.html"], ["5.10.08", "Dividing a Whole Number by a Decimal", "math-lesson-5-10-08-dividing-a-whole-number-by-a-decimal.html"], ["5.11.01", "Measuring Angles", "math-lesson-5-11-01-measuring-angles.html"], ["5.11.02", "Angles and Lines", "math-lesson-5-11-02-angles-and-lines.html"], ["5.11.03", "Classifying Triangles", "math-lesson-5-11-03-classifying-triangles.html"], ["5.11.04", "The Sum of the Angles in a Triangle", "math-lesson-5-11-04-the-sum-of-the-angles-in-a-triangle.html"], ["5.11.05", "Classifying Quadrilaterals", "math-lesson-5-11-05-classifying-quadrilaterals.html"], ["5.11.06", "Angles of Quadrilaterals Part 1", "math-lesson-5-11-06-angles-of-quadrilaterals-part-1.html"], ["5.11.07", "Angles of Quadrilaterals Part 2", "math-lesson-5-11-07-angles-of-quadrilaterals-part-2.html"], ["5.11.08", "Drawing Triangles and Quadrilaterals", "math-lesson-5-11-08-drawing-triangles-and-quadrilaterals.html"], ["5.12.01", "Average Part 1", "math-lesson-5-12-01-average-part-1.html"], ["5.12.02", "Average Part 2", "math-lesson-5-12-02-average-part-2.html"], ["5.12.03", "Line Plots", "math-lesson-5-12-03-line-plots.html"], ["5.12.04", "Coordinate Graphs", "math-lesson-5-12-04-coordinate-graphs.html"], ["5.12.05", "Straight Line Graphs", "math-lesson-5-12-05-straight-line-graphs.html"], ["5.13.01", "Finding the Ratio", "math-lesson-5-13-01-finding-the-ratio.html"], ["5.13.02", "Equivalent Ratios", "math-lesson-5-13-02-equivalent-ratios.html"], ["5.13.03", "Finding a Quantity", "math-lesson-5-13-03-finding-a-quantity.html"], ["5.13.04", "Comparing Three Quantities", "math-lesson-5-13-04-comparing-three-quantities.html"], ["5.13.05", "Word Problems", "math-lesson-5-13-05-word-problems.html"], ["5.14.01", "Finding the Rate", "math-lesson-5-14-01-finding-the-rate.html"], ["5.14.02", "Rate Problem Part 1", "math-lesson-5-14-02-rate-problem-part-1.html"], ["5.14.03", "Rate Problem Part 2", "math-lesson-5-14-03-rate-problem-part-2.html"], ["5.14.04", "Word Problems", "math-lesson-5-14-04-word-problems.html"], ["5.15.01", "Meaning of Percentage", "math-lesson-5-15-01-meaning-of-percentage.html"], ["5.15.02", "Expressing Percentages As Fractions", "math-lesson-5-15-02-expressing-percentages-as-fractions.html"], ["5.15.03", "Percentages and Decimals", "math-lesson-5-15-03-percentages-and-decimals.html"], ["5.15.04", "Expressing Fractions As Percentages", "math-lesson-5-15-04-expressing-fractions-as-percentages.html"], ["5.15.05", "Percentage of a Quantity", "math-lesson-5-15-05-percentage-of-a-quantity.html"], ["5.15.06", "Word Problems", "math-lesson-5-15-06-word-problems.html"]];

  /* ───── Student directions (shown on every tool page, in lesson bundles and in the Canvas embed code) ───── */
  var HOW = {
    discs: ['Drag a disc from the tray onto its column to add it.', 'Drag a disc onto the next smaller column to break it into 10.', 'Got 10 or more? Drag one up onto the bigger column to trade 10 for 1.', 'Drag a disc off the mat to take it away. Read your number below.'],
    pvcards: ['Drag a card down to pull it out of the stack.', 'Each card shows what one digit is worth.', 'Drag the cards back up to push them together into one number.', 'Say the number, then say what each card is worth.'],
    blocks: ['Drag a block from the tray onto its column to add it.', 'Drag a block onto the next smaller column to break it into 10.', 'Got 10 or more? Drag one up onto the bigger column to group 10 into 1.', 'Drag a block off the mat to take it away.'],
    bond: ['Tap a circle and type a number.', 'Type ? in the circle for the number you need to find.', 'Parts go in the small circles. The whole goes in the big circle.', 'Check: do the parts add up to the whole?'],
    bar: ['Start from a bar model in Set up, or build your own bars.', 'Type the numbers you know. Put ? where the number you need to find goes.', 'Drag the end of a piece to make it longer or shorter.', 'Tap a piece to color it. Then write the number sentence on your paper.'],
    numberline: ['Drag a dot from the cup onto the line. It snaps to a mark.', 'Slide a dot along the line, or drag it off to take it away.', 'To show a jump, turn on Hops and drag from one mark to another.', 'Say the number at each dot before you check.'],
    counters: ['Array: drag across counters to flip them from red to yellow.', 'Drag the scissors between two columns to split the array.', 'Share: drag counters from the pile into the groups.', 'Make the groups equal. What is left over?'],
    hundred: ['Tap a number, or drag across numbers, to color them.', 'In Set up, choose a number to skip-count by. Those numbers light up.', 'Pick a second number to see where both colors land.', 'Look for a pattern. Say what you notice.'],
    dice: ['Pick dice, number cards or fact cards.', 'Tap Roll, or tap Next card.', 'For a number game, tap a box to place each digit.', 'Say your number or answer before you check.'],
    fbars: ['The top bar is 1 whole.', 'Drag fraction tiles from the tray onto the bar. They line up end to end.', 'Drag a tile off the bar to take it away.', 'Do your tiles fill the whole? Read the sum below the bar.'],
    fcircles: ['Each circle is 1 whole cut into equal slices.', 'Drag a slice from the tray into a circle, or drag across slices to shade them.', 'Fill a whole circle before you start the next one.', 'Read your amount as a fraction and as a mixed number.'],
    decgrid: ['One whole grid is 1.', 'Drag across squares to shade them.', 'A column of 10 small squares is 1 tenth.', 'Read your shaded amount as a decimal and as a fraction.'],
    money: ['Drag coins and bills from the tray onto the mat.', 'Drag money off the mat to take it away.', 'Count from the biggest bill or coin to the smallest.', 'Making change? Count up from the price, and drag the change into the box.'],
    ruler: ['Drag the ribbon so its left end is on 0.', 'Drag the round end to make the ribbon longer or shorter.', 'Read the mark at the right end.', 'Say the length and the unit, like “7 centimeters”.'],
    scale: ['Drag the box onto the scale. Read where the red pointer stops.', 'Count by the small marks to find what each one is worth.', 'Balance: drag weights onto the right pan until the pans are level.', 'Level pans mean the box weighs the same as the weights.'],
    beaker: ['Drag up or down inside a beaker to fill it.', 'Read the mark at the top of the water. Count by the small marks.', 'Drag the yellow pour handle over the other beaker to pour.', 'Say the amount and the unit, like “650 milliliters”.'],
    clock: ['Drag the long hand to move the minutes. The short hand follows.', 'Read the hour first, then the minutes.', 'For time passed, set the start time, then drag the long hand forward.', 'Count the hours, then the minutes, from start to end.'],
    trademat: ['Drag pieces from the tray onto the mat to build the amount.', 'Drag a big piece onto the small column to break it.', 'Got enough small pieces? Drag one onto the big column to trade.', 'Taking away? Drag pieces into the box. Read what is left.'],
    barstrip: ['The long bar is the whole.', 'Drag pieces from the tray onto the bar. They line up end to end.', 'Drag a piece off the bar to take it away.', 'How many pieces fill the bar? Comparing? Fill both bars and look.'],
    tiles: ['Drag a color tile onto the grid, or drag across the grid to lay tiles.', 'Drag a tile off the grid to pick it up.', 'Count the squares to find the area.', 'Turn on the outline and count the edges to find the perimeter.'],
    geoboard: ['Press on a pin and stretch the band to another pin.', 'Keep stretching from pin to pin. End on the first pin to close the shape.', 'Drag a corner to a new pin to change the shape.', 'Count the sides and look for square corners.'],
    whiteboard: ['Pick grid, dots, lines or blank paper.', 'Pick a color and draw with your finger or mouse.', 'Use the line tool for straight lines and Undo to fix a mistake.', 'Show every step of your thinking.'],
    tangram: ['Drag a piece into the gray shape.', 'Drag the round handle to turn a piece.', 'Keep going until every piece fits with no gaps.', 'Stuck? Ask your teacher before you peek at the answer.'],
    pattern: ['Drag blocks from the top onto the mat.', 'Drag the round handle to turn a block.', 'Drag a block back to the top to put it away.', 'Fractions: if the yellow hexagon is 1 whole, how much is each block?'],
    protractor: ['The center of the protractor sits on the corner of the angle.', 'One arm lines up with 0.', 'Drag the green arm. Read the scale that starts at 0.', 'Ask yourself: is the angle smaller or bigger than a right angle?'],
    setsquare: ['Drag a ruler or triangle to slide it. Drag its handle to turn it.', 'Pick Draw, then drag along an edge to draw a straight line.', 'Perpendicular: draw along both short edges of a triangle corner.', 'Parallel: slide the triangle along the ruler and draw again.'],
    compass: ['Drag the gray point to where the center goes.', 'Drag the yellow pencil out to open the compass.', 'Drag the pencil all the way around to draw the circle.', 'The radius goes from the center to the edge. The diameter goes all the way across.'],
    cubes: ['Drag a cube from the tray onto a square to stack it.', 'Drag the top cube off to take it away.', 'Turn the view to see the back.', 'Count the cubes. That is the volume.']
  };
  tools.forEach(function (t) { t.how = HOW[t.id] || []; });

  /* ───── Lesson tags ─────
     Each unit lists its tools: [tool id, preset (state), student "Try this", teacher tip].
     A lesson can add its own entries (they go first and replace the unit entry for the same tool). */
  function R(n, t, tp, pieces) { return { n: n, t: t, tp: tp || 'above', p: (typeof pieces === 'number' ? Array(pieces).fill(0).map(function () { return {}; }) : pieces).map(function (p) { return { v: p.v || p[0] || '', l: p.l || p[1] || '', c: p.c || p[2] || 0 }; }) }; }
  function BAR(rows, cmp) { return { bars: rows, cmp: cmp ? { on: 1, a: cmp[0], b: cmp[1], l: cmp[2] } : { on: 0, a: 0, b: 1, l: '' } }; }
  function RECT(w, h, x0, y0, col) { var c = {}; for (var x = 0; x < w; x++) for (var y = 0; y < h; y++) c[(x + (x0 || 0)) + '_' + (y + (y0 || 0))] = col || 0; return c; }
  function BOX(L, W, H) { var h = {}; for (var x = 0; x < L; x++) for (var y = 0; y < W; y++) h[x + '_' + y] = H; return h; }
  function T(t, p, s, tip, g) { return { t: t, p: p || null, s: s || '', tip: tip || '', g: g || null }; }
  /* goal: [what to do, answer, [[wrong answer, hint that points where to look]...], report key] */

  var U = {
    /* ═════════ GRADE 3 ═════════ */
    '3.01': { name: 'Numbers to 10,000', tools: [
      T('discs', { hi: 3, lo: 0, c: { 3: 2, 2: 4, 0: 7 } }, 'Build 2,407 with discs. Which column is empty? Why do we still write a 0?', 'Discs before digits: have students build, then write. Point out the empty tens column.'),
      T('pvcards', { n: '2407' }, 'Pull the cards apart. What is the 4 worth?', 'Arrow cards make expanded form concrete; push together to show why zeros are hidden.'),
      T('numberline', { a: 0, b: 10000, parts: 10, mode: 'whole', lab: 'ends' }, 'Fill in the missing thousands on the line.', 'Ends-only labels make students reason about the interval.') ],
      L: {
        '3.01.01': [T('blocks', { c: { 3: 1, 2: 2, 1: 3, 0: 4 } }, 'What number do the blocks show? Break the thousand cube. How many hundreds is it?', 'Blocks show size; discs (next lesson) show value. Use both so students see the link.')],
        '3.01.03': [T('pvcards', { n: '3462' }, 'Build 3,462, then 3,426. Which place tells you which is bigger?', 'Compare from the greatest place; build both numbers.')],
        '3.01.04': [T('numberline', { a: 3000, b: 4000, parts: 10, mode: 'whole', lab: 'ends' }, 'Put a dot on 3,400 and 3,750. Which hundred is 3,750 closer to?', 'Ends-only labels; students name every tick first.')],
        '3.01.05': [T('hundred', { mode: 'hundred', start: 1, sk1: 5 }, 'Skip-count by 5. What do you notice about the ones digits?', 'Patterns of +10/+100 transfer to the disc mat: add one disc each time.'), T('discs', { hi: 3, lo: 0, c: { 3: 1, 2: 2, 0: 5 } }, 'Add one hundred disc at a time. What changes in the number? What stays the same?', '')],
        '3.01.06': [T('numberline', { a: 4000, b: 5000, parts: 10, mode: 'whole', lab: 'ends' }, 'Put a dot on 4,600. Is it closer to 4,000 or 5,000?', 'Find the halfway mark first (4,500).')],
        '3.01.07': [T('numberline', { a: 300, b: 400, parts: 10, mode: 'whole', lab: 'ends' }, 'Put a dot on 362. Round it to the nearest hundred.', 'Halfway is 350; numbers on halfway round up.')],
        '3.01.08': [T('numberline', { a: 40, b: 50, parts: 10, mode: 'whole', lab: 'all' }, 'Put a dot on 47. Is it closer to 40 or 50?', '')]
      } },
    '3.02': { name: 'Mental Addition and Subtraction', tools: [
      T('bond', { parts: 2, w: '100', p: ['63', '?'] }, 'What goes with 63 to make 100?', 'Number bonds to 10, 100 and 1,000 are the heart of this chapter.'),
      T('numberline', { a: 0, b: 100, parts: 10, mode: 'whole', lab: 'all', hop: 1 }, 'Show 38 + 25 with hops: jump to the next ten first.', 'Hops make “make a ten” visible.'),
      T('discs', { hi: 2, lo: 0, c: { 2: 3, 1: 5, 0: 8 } }, 'Add 1 hundred, then 2 tens. What is the new number?', 'Use discs to show adding tens and hundreds mentally without regrouping.') ],
      L: {
        '3.02.05': [T('bond', { parts: 2, w: '1,000', p: ['650', '?'] }, 'What goes with 650 to make 1,000?', 'Use the 100s and 10s complements.')],
        '3.02.06': [T('numberline', { a: 400, b: 700, parts: 30, mode: 'whole', lab: 'ends', hop: 1 }, 'Show 452 + 198: add 200, then hop back 2.', 'Compensation strategy: overshoot then adjust.')],
        '3.02.07': [T('bar', BAR([R('Sum', '?', 'above', [['', '135', 1], ['', '68', 2]])]), 'Draw the two numbers as one bar. What is the total?', 'Sum and difference both come from one part-whole bar.')],
        '3.02.08': [T('bar', BAR([R('', '240', 'above', [['85', '85', 1], ['', '?', 0]])]), 'Find the missing part.', 'Part-whole: the whole is known, one part is missing.')],
        '3.02.09': [T('bar', BAR([R('Ali', '', 'above', [['325', '325', 1]]), R('Ben', '', 'below', [['325', '', 2], ['', '?', 0]])], [0, 1, '48 more']), 'Ben has 48 more than Ali. Draw it.', 'Comparison model: line up the left edges.')],
        '3.02.10': [T('bar', BAR([R('', '?', 'above', [['', '', 1], ['', '', 2], ['', '', 3]])]), 'Draw both steps of the story on one bar.', 'Two-step problems: one model, two number sentences.')]
      } },
    '3.03': { name: 'Addition and Subtraction with Regrouping', tools: [
      T('discs', { hi: 3, lo: 0, c: { 2: 4, 1: 7, 0: 8 } }, 'Add 365 with discs. When a column has 10 or more, trade.', 'Regroup on the mat first, then record each trade in the algorithm.'),
      T('blocks', { c: { 2: 4, 1: 7, 0: 8 } }, 'Use blocks to show the same problem. Group 10 ones into a ten.', ''),
      T('bar', BAR([R('', '?', 'above', [['', '', 1], ['', '', 2]])]), 'Draw the story before you add or subtract.', '') ],
      L: {
        '3.03.02': [T('discs', { hi: 2, lo: 0, c: { 2: 5, 1: 2, 0: 3 } }, 'Take away 168 from 523. Break a disc when you don’t have enough.', 'Students break a ten, then a hundred, before they subtract.')],
        '3.03.03': [T('discs', { hi: 3, lo: 0, c: { 3: 1 } }, 'Take away 1 from 1,000. How many breaks do you need?', 'Subtracting across zeros: break 1,000 → 10 hundreds → 9 hundreds 10 tens, and so on.')],
        '3.03.04': [T('numberline', { a: 300, b: 400, parts: 10, mode: 'whole', lab: 'ends' }, 'Round each number to the nearest hundred before you add.', 'Estimate first, then compute and compare.')],
        '3.03.05': [T('numberline', { a: 4000, b: 5000, parts: 10, mode: 'whole', lab: 'ends' }, 'Round to the nearest thousand to estimate.', '')]
      } },
    '3.04': { name: 'Multiplication and Division', tools: [
      T('counters', { mode: 'array', r: 3, c: 6 }, 'How many rows? How many in each row? Write the multiplication.', 'Arrays show equal groups and the commutative property (turn it sideways).'),
      T('counters', { mode: 'share', n: 18, g: 3 }, 'Share 18 counters into 3 groups. How many in each group?', ''),
      T('hundred', { mode: 'hundred', start: 1, sk1: 3 }, 'Skip-count by 3. Say each number as you tap it.', ''),
      T('dice', { mode: 'facts', op: 'm', lo: 2, hi: 5 }, 'Say the answer, then flip the card to check.', 'Fact practice for 2, 3, 4, 5 and 10.') ],
      L: {
        '3.04.02': [T('counters', { mode: 'array', r: 4, c: 7, split: 5 }, 'Split the array. 4 × 7 = 4 × 5 + 4 × 2.', 'Distributive property: split a hard fact into two easy ones.')],
        '3.04.04': [T('counters', { mode: 'share', n: 6, g: 1 }, 'Share 6 counters into 1 group. Now try 0 counters into 3 groups.', '')],
        '3.04.05': [T('counters', { mode: 'share', n: 14, g: 3 }, 'Share 14 into 3 groups. How many are left over?', 'The remainder must be less than the number of groups.')],
        '3.04.06': [T('counters', { mode: 'array', r: 2, c: 7 }, 'Can you put every counter in a pair? Then the number is even.', 'Even = 2 equal rows with none left.'), T('hundred', { mode: 'hundred', start: 1, sk1: 2 }, 'Skip-count by 2. Which ones digits do the even numbers end in?', '')],
        '3.04.07': [T('bar', BAR([R('', '?', 'above', 4)]), 'Each unit is one group. Label one unit, then find the total.', 'Equal-units bar model for multiplication.')],
        '3.04.08': [T('bar', BAR([R('', '36', 'above', [['', '?', 1], ['', '', 0], ['', '', 0], ['', '', 0]])]), 'The whole is shared into equal units. Find 1 unit.', 'Division as finding one unit.')],
        '3.04.09': [T('bar', BAR([R('', '?', 'above', [['', '', 1], ['', '', 1], ['', '', 1], ['', '', 2]])]), 'Draw both steps of the story on one bar.', '')]
      } },
    '3.05': { name: 'Multiplication', tools: [
      T('discs', { hi: 3, lo: 0, c: { 1: 2, 0: 4 } }, 'Make 3 groups of 24. Put all the discs together and trade.', 'Build the factor as many times as the multiplier; regroup; then record the algorithm.'),
      T('counters', { mode: 'array', r: 3, c: 12, split: 10 }, 'Split 3 × 12 into 3 × 10 and 3 × 2.', 'Area/array split leads to partial products.') ],
      L: {
        '3.05.01': [T('discs', { hi: 3, lo: 0, c: { 2: 3 } }, 'Make 3 hundreds 4 times. How many hundreds? What number is that?', '4 × 3 hundreds = 12 hundreds = 1,200.')]
      } },
    '3.06': { name: 'Division', tools: [
      T('discs', { hi: 2, lo: 0, c: { 1: 5, 0: 4 } }, 'Share 54 into 3 groups. Break a ten when you need to.', 'Divide tens first; break leftover tens into ones; record each step.'),
      T('counters', { mode: 'share', n: 25, g: 4 }, 'Share 25 into 4 groups. What is left over?', '') ],
      L: {
        '3.06.01': [T('discs', { hi: 2, lo: 0, c: { 2: 6 } }, 'Share 6 hundreds into 2 groups. How many in each?', '6 hundreds ÷ 2 = 3 hundreds.')]
      } },
    '3.07': { name: 'Graphs and Tables', tools: [
      T('dice', { mode: 'dice', k: 1, sides: 6 }, 'Roll 20 times. Keep a tally of each number.', 'Collect real data, then graph it on the grid whiteboard.'),
      T('whiteboard', { bg: 'grid' }, 'Draw a bar graph of your tally. Label both sides and give it a title.', ''),
      T('tiles', { cols: 12, rows: 10 }, 'Use one column of tiles for each group to build a bar graph.', 'Tiles make a quick concrete bar graph.') ] },
    '3.08': { name: 'Multiplying and Dividing by 6, 7, 8 and 9', tools: [
      T('hundred', { mode: 'times', sk1: 6 }, 'Find the 6s row and column. What pattern do you see?', ''),
      T('counters', { mode: 'array', r: 6, c: 7, split: 5 }, 'Split 6 × 7 into 6 × 5 and 6 × 2.', 'Use known 5s facts to build new facts.'),
      T('dice', { mode: 'facts', op: 'm', lo: 6, hi: 9 }, 'Say the answer, then flip the card to check.', '') ],
      L: {
        '3.08.02': [T('hundred', { mode: 'times', sk1: 7 }, 'Find the 7s. Which ones do you already know?', '')],
        '3.08.04': [T('counters', { mode: 'share', n: 42, g: 6 }, 'Share 42 into 6 groups. Which multiplication fact helps?', '')],
        '3.08.05': [T('hundred', { mode: 'times', sk1: 8, sk2: 4 }, 'The 8s are double the 4s. Check it.', '')],
        '3.08.06': [T('hundred', { mode: 'times', sk1: 9 }, 'Add the digits of each 9s answer. What do you get?', '')]
      } },
    '3.09': { name: 'Fractions, Part 1', tools: [
      T('fcircles', { c: 1, n: 4 }, 'Shade 3 slices. What fraction of the circle is shaded?', 'Equal parts first: talk about why the slices must be the same size.'),
      T('fbars', { d: [2, 3, 4, 6, 8], lab: 1 }, 'Shade 1 tile in each row. Which unit fraction is biggest?', 'More pieces in the whole means smaller pieces.'),
      T('numberline', { a: 0, b: 1, parts: 4, mode: 'frac', lab: 'ends' }, 'Name every mark between 0 and 1.', '') ],
      L: {
        '3.09.02': [T('numberline', { a: 0, b: 2, parts: 8, mode: 'frac', lab: 'ends' }, 'Put dots on three fourths and on five fourths.', 'Fractions greater than 1 on the line.')],
        '3.09.03': [T('fbars', { d: [8], lab: 1 }, 'Shade 3 eighths, then 5 eighths. Which is more?', 'Same denominator: compare the number of pieces.')],
        '3.09.04': [T('fbars', { d: [3, 5, 8], lab: 1 }, 'Shade 2 tiles in each row. Which row shows the most?', 'Same numerator: bigger pieces make the bigger fraction.')]
      } },
    '3.10': { name: 'Fractions, Part 2', tools: [
      T('fbars', { d: [3, 6], lab: 1 }, 'Shade 1 third. How many sixths line up with it?', 'Use the line-up guide to prove equivalence.'),
      T('numberline', { a: 0, b: 1, parts: 3, mode: 'frac', lab: 'all', two: 1, parts2: 6 }, 'Which marks land in the same spot on both lines?', ''),
      T('pattern', { frac: true }, 'The hexagon is 1 whole. Cover it with triangles. What fraction is 1 triangle?', '') ],
      L: {
        '3.10.03': [T('fbars', { d: [2, 4, 8], lab: 1 }, 'Shade 6 eighths. Find the fewest tiles that cover the same amount.', 'Simplest form = fewest, biggest pieces.')],
        '3.10.04': [T('fbars', { d: [2, 3, 4, 6], lab: 1 }, 'Compare 2 thirds and 3 fourths. Line them up.', '')],
        '3.10.06': [T('fbars', { d: [5], lab: 1 }, 'Shade 2 fifths, then 2 more. How many fifths in all?', 'Add like fractions by counting unit fractions.')],
        '3.10.07': [T('fbars', { d: [4, 8], lab: 1 }, 'Shade 1 fourth and 3 eighths. How many eighths is that?', 'Related denominators: change fourths to eighths.')]
      } },
    '3.11': { name: 'Measurement', tools: [
      T('ruler', { u: 'm', a: 0, b: 64, len: 64 }, 'How long is the ribbon? Write it in centimeters.', '1 meter = 100 centimeters.'),
      T('bond', { parts: 2, w: '1 m', p: ['64 cm', '?'] }, 'What goes with 64 cm to make 1 meter?', ''),
      T('bar', BAR([R('', '?', 'above', [['', '', 1], ['', '', 2]])]), 'Draw the measurement story as a bar.', '') ],
      L: {
        '3.11.03': [T('bond', { parts: 2, w: '1 km', p: ['650 m', '?'] }, 'What goes with 650 m to make 1 kilometer?', '1 km = 1,000 m.'), T('numberline', { a: 0, b: 2000, parts: 20, mode: 'whole', lab: 'ends' }, 'Put a dot on 1 km 300 m. How many meters is that?', '')],
        '3.11.04': [T('bond', { parts: 2, w: '1,000', p: ['375', '?'] }, 'Take 375 m away from 1 km. Use the bond.', '')],
        '3.11.05': [T('beaker', { u: 'ml', mx: 2000, tk: 100, c: 2, tk: 50, a0: 1250, a1: 600 }, 'How much water is in each beaker? How much in all?', '1 L = 1,000 mL.')],
        '3.11.06': [T('scale', { m: 'dial', u: 'kg', mx: 1, tk: 20, w: 640 }, 'What does the scale show? How many more grams make 1 kg?', 'Count the small marks to find their value first.'), T('scale', { m: 'bal', bw: 350 }, 'Balance the box. How heavy is it?', '')],
        '3.11.07': [T('bar', BAR([R('', '2 kg', 'above', [['', '750 g', 1], ['', '?', 0]])]), 'Find the missing part. Change kilograms to grams first.', '')]
      } },
    '3.12': { name: 'Geometry', tools: [
      T('geoboard', { n: 11 }, 'Make a shape with 4 sides. How many square corners does it have?', ''),
      T('tangram', { pz: 'sq7' }, 'Make the square with all seven pieces.', 'Tangrams build spatial reasoning about triangles and quadrilaterals.'),
      T('compass', { r: 3 }, 'Draw a circle with a radius of 3 cm. What is its diameter?', '') ],
      L: {
        '3.12.01': [T('compass', { r: 3, circ: [[9, 6, 3]], lines: true }, 'Measure the radius and the diameter. What do you notice?', 'Diameter = 2 radii.')],
        '3.12.02': [T('geoboard', { n: 11, mode: 'line' }, 'Make an angle with two bands that meet at one pin.', ''), T('clock', { t: 180, dg: 0 }, 'The hands make an angle. Is it a square corner?', '')],
        '3.12.03': [T('setsquare', { mode: 'move', sel: 's45' }, 'Use the square corner of the triangle to check for right angles.', 'The set square corner is a right angle tester.')],
        '3.12.04': [T('geoboard', { n: 11 }, 'Make 3 different triangles.', ''), T('tangram', { pz: 'tri3' }, 'Make a big triangle from smaller pieces.', '')],
        '3.12.05': [T('geoboard', { n: 11 }, 'Make a triangle with a right angle. Make one with two equal sides.', '')],
        '3.12.06': [T('geoboard', { n: 11, bands: [{ p: [[1, 1], [6, 1], [6, 4], [1, 4]], k: 1, c: 0 }] }, 'Change the rectangle into a different quadrilateral. What changed?', '')],
        '3.12.07': [T('compass', { r: 4 }, 'Set the compass to 4 cm and draw a circle.', 'Practice on screen, then with the safety compass.')]
      } },

    /* ═════════ GRADE 4 ═════════ */
    '4.01': { name: 'Numbers to One Million', tools: [
      T('discs', { hi: 5, lo: 0, c: { 5: 2, 4: 3, 2: 4, 0: 6 } }, 'What number do the discs show? Read it in two parts: thousands, then ones.', 'Use the 10-value discs; read the thousands period, then the ones period.'),
      T('pvcards', { n: '230406' }, 'Pull the cards apart. Which digits are in the thousands period?', ''),
      T('numberline', { a: 40000, b: 50000, parts: 10, mode: 'whole', lab: 'ends' }, 'Name every mark on the line.', '') ],
      L: {
        '4.01.02': [T('discs', { hi: 6, lo: 0, c: { 5: 9, 4: 9, 3: 9, 2: 9, 1: 9, 0: 9 } }, 'Add one more ones disc. Keep trading. What number do you get?', '999,999 + 1 = 1,000,000 by repeated trading.')],
        '4.01.03': [T('discs', { hi: 5, lo: 0, c: { 4: 4, 3: 2 } }, 'Add 1 ten thousand each time. What changes?', '')],
        '4.01.04': [T('pvcards', { n: '345210' }, 'Build 345,210 and 354,120. Which is greater? Which place told you?', '')],
        '4.01.05': [T('numberline', { a: 42000, b: 43000, parts: 10, mode: 'whole', lab: 'ends' }, 'Put a dot on 42,650. Round it to the nearest thousand.', '')],
        '4.01.06': [T('numberline', { a: 300000, b: 400000, parts: 10, mode: 'whole', lab: 'ends' }, 'Round 362,500 to the nearest ten thousand and hundred thousand.', '')],
        '4.01.07': [T('discs', { hi: 5, lo: 0, c: { 4: 3, 3: 5 } }, 'Add 4 thousands. Did you need to trade?', 'Mental calculation by place value.')]
      } },
    '4.02': { name: 'Addition and Subtraction', tools: [
      T('discs', { hi: 5, lo: 0, c: { 4: 2, 3: 4, 2: 6, 1: 5, 0: 3 } }, 'Add or take away with discs. Trade when you need to.', 'Model one problem on the mat, then do the next with the algorithm only.'),
      T('bar', BAR([R('', '?', 'above', [['', '', 1], ['', '', 2]])]), 'Draw the story before you solve it.', '') ],
      L: {
        '4.02.02': [T('discs', { hi: 4, lo: 0, c: { 4: 1 } }, 'Take away 1 from 10,000. Break one disc at a time.', '')],
        '4.02.03': [T('numberline', { a: 3000, b: 6000, parts: 30, mode: 'whole', lab: 'ends', hop: 1 }, 'Show 3,456 + 1,998: add 2,000, then hop back 2.', 'Compensation with a number line.'), T('bond', { parts: 2, w: '5,000', p: ['3,627', '?'] }, 'What goes with 3,627 to make 5,000?', '')],
        '4.02.04': [T('numberline', { a: 2000, b: 5000, parts: 30, mode: 'whole', lab: 'ends', hop: 1 }, 'Show 4,200 − 1,995 by taking away 2,000, then adding 5 back.', '')],
        '4.02.05': [T('bar', BAR([R('Monday', '', 'above', [['2450', '2,450', 1]]), R('Tuesday', '', 'below', [['2450', '', 2], ['', '?', 0]])], [0, 1, '1,375 more']), 'Draw the comparison, then find the total.', '')]
      } },
    '4.03': { name: 'Multiples and Factors', tools: [
      T('hundred', { mode: 'hundred', start: 1, sk1: 4 }, 'Skip-count by 4. These are the multiples of 4.', ''),
      T('counters', { mode: 'array', r: 3, c: 8 }, 'How many different arrays can you make with 24 counters?', 'Each array is a factor pair.') ],
      L: {
        '4.03.02': [T('hundred', { mode: 'hundred', start: 1, sk1: 4, sk2: 6 }, 'Where do the 4s and 6s land on the same number?', 'Split cells = common multiples.')],
        '4.03.03': [T('hundred', { mode: 'times', fac: 1, fv: 24 }, 'Tap 24. Find every pair that makes it.', '')],
        '4.03.04': [T('counters', { mode: 'array', r: 1, c: 7 }, '7 counters make only one array. That makes 7 prime. Try 12.', ''), T('hundred', { mode: 'hundred', start: 1 }, 'Color the numbers with only 2 factors.', '')],
        '4.03.05': [T('hundred', { mode: 'times', fac: 1, fv: 18 }, 'Find the factors of 18, then of 24. Which ones match?', '')]
      } },
    '4.04': { name: 'Multiplication', tools: [
      T('discs', { hi: 4, lo: 0, c: { 2: 2, 1: 3, 0: 4 } }, 'Make 3 groups of 234. Put them together and trade.', 'Concrete first, then partial products, then the algorithm.'),
      T('counters', { mode: 'array', r: 4, c: 13, split: 10 }, 'Split 4 × 13 into 4 × 10 and 4 × 3.', ''),
      T('whiteboard', { bg: 'grid' }, 'Line up your digits in the grid squares.', 'Grid paper keeps place values lined up.') ],
      L: {
        '4.04.01': [T('counters', { mode: 'array', r: 4, c: 25, split: 20 }, 'Split 4 × 25 into two easy parts.', '')],
        '4.04.04': [T('discs', { hi: 4, lo: 0, c: { 1: 3 } }, 'Make 3 tens 20 times. How many hundreds is that?', '3 tens × 20 = 60 tens = 6 hundreds.')]
      } },
    '4.05': { name: 'Division', tools: [
      T('discs', { hi: 3, lo: 0, c: { 3: 2, 2: 3, 1: 4, 0: 5 } }, 'Share the discs into 3 groups. Break a disc when you can’t share it.', 'Share from the greatest place; each break is a step in long division.'),
      T('counters', { mode: 'share', n: 29, g: 4 }, 'Share 29 into 4 groups. What is left over?', '') ],
      L: {
        '4.05.01': [T('discs', { hi: 3, lo: 0, c: { 3: 8 } }, 'Share 8 thousands into 4 groups.', '8 thousands ÷ 4 = 2 thousands.')],
        '4.05.02': [T('hundred', { mode: 'times', sk1: 6 }, 'Find the multiple of 6 closest to 43.', 'Estimate with nearby multiples.')],
        '4.05.04': [T('bar', BAR([R('', '1,260', 'above', [['', '?', 1], ['', '', 0], ['', '', 0], ['', '', 0], ['', '', 0], ['', '', 0]])]), 'The total is shared into 6 equal units. Find 1 unit.', '')]
      } },
    '4.06': { name: 'Fractions', tools: [
      T('fbars', { d: [2, 3, 4, 6, 8, 12], lab: 1 }, 'Shade 2 fourths. Find other rows that match it.', ''),
      T('fcircles', { c: 3, n: 4 }, 'Shade 7 fourths. How many whole circles is that?', ''),
      T('numberline', { a: 0, b: 3, parts: 12, mode: 'mixed', lab: 'ends' }, 'Put a dot on 2 and 1 fourth.', '') ],
      L: {
        '4.06.01': [T('fbars', { d: [3, 6, 12], lab: 1 }, 'Shade 2 thirds. How many sixths? How many twelfths?', '')],
        '4.06.02': [T('fbars', { d: [3, 4, 6, 8, 12], lab: 1 }, 'Order 3 fourths, 2 thirds and 5 sixths from least to greatest.', 'Line up the right edges with the guide.')],
        '4.06.03': [T('fbars', { d: [4], w: 3, lab: 1, sh: { 4: [0, 1, 2, 3, 4] } }, 'Read the shaded tiles two ways: as fourths, and as wholes and fourths.', '')],
        '4.06.06': [T('fcircles', { c: 3, n: 4 }, 'Share 3 circles among 4 people. How much does each get?', '3 ÷ 4 = three fourths.')]
      } },
    '4.07': { name: 'Adding and Subtracting Fractions', tools: [
      T('fbars', { d: [2, 4, 8], w: 2, lab: 1 }, 'Shade the first fraction, then keep going for the second.', ''),
      T('fcircles', { c: 3, n: 4 }, 'Shade 1 and 3 fourths, then add 2 fourths.', ''),
      T('numberline', { a: 0, b: 3, parts: 12, mode: 'mixed', lab: 'ends', hop: 1 }, 'Show the adding with hops.', '') ],
      L: {
        '4.07.02': [T('fbars', { d: [3, 6, 12], lab: 1 }, 'Add 1 third and 1 sixth. Change thirds to sixths first.', '')],
        '4.07.04': [T('fcircles', { c: 4, n: 4, sh: [[0, 1, 2, 3], [0, 1, 2], [], []] }, 'Add 1 and 2 fourths more. Make a whole when you can.', '')],
        '4.07.05': [T('fcircles', { c: 3, n: 4, sh: [[0, 1, 2, 3], [0, 1, 2, 3], [0]] }, 'Take away 3 fourths. Break a whole if you need to.', '')]
      } },
    '4.08': { name: 'Multiplying a Fraction and a Whole Number', tools: [
      T('fbars', { d: [4], w: 3, lab: 1 }, 'Shade 3 fourths, 3 times. How many fourths in all?', 'Repeated adding of the same fraction.'),
      T('bar', BAR([R('', '40', 'above', [['', '', 2], ['', '', 2], ['', '', 2], ['', '', 0], ['', '', 0]])]), 'The bar is 40. What is 3 fifths of it?', ''),
      T('numberline', { a: 0, b: 3, parts: 12, mode: 'mixed', lab: 'ends', hop: 1 }, 'Show 5 hops of 1 half.', '') ],
      L: {
        '4.08.04': [T('counters', { mode: 'share', n: 12, g: 3 }, 'Share 12 into 3 groups. How many is 2 thirds of 12?', 'A fraction of a set: find 1 group, then take that many groups.')],
        '4.08.07': [T('bar', BAR([R('', '?', 'above', [['', '', 1], ['', '', 1], ['', '', 0], ['', '', 0], ['', '', 0]])]), 'Draw the story with equal units.', '')]
      } },
    '4.09': { name: 'Data: Line Plots and Line Graphs', tools: [
      T('numberline', { a: 0, b: 3, parts: 6, mode: 'mixed', lab: 'all' }, 'Use the line as a line plot. Tap a mark for each data value.', 'The number line doubles as a line plot.'),
      T('whiteboard', { bg: 'grid' }, 'Draw your graph on the grid. Label both sides.', ''),
      T('dice', { mode: 'dice', k: 2, sides: 6 }, 'Roll two dice 20 times. Record each sum.', 'Collect a data set to plot.') ],
      L: {
        '4.09.03': [T('whiteboard', { bg: 'lined' }, 'Make a stem-and-leaf plot. Stems on the left, leaves on the right.', '')]
      } },
    '4.10': { name: 'Measurement', tools: [
      T('ruler', { u: 'cm', a: 0, b: 7.5, len: 7.5 }, 'How long is the ribbon in centimeters? In millimeters?', ''),
      T('bar', BAR([R('1 ft', '12 in', 'above', 3)]), 'One foot is 12 inches. What is 1 unit? 2 units?', 'Bar Strip with 12 pieces works well here.'),
      T('trademat', { u: 'ftin', b0: 3, s0: 8, take: 0 }, 'Add 1 ft 6 in to the mat. Trade 12 inches for 1 foot when you can.', 'The Trade Mat makes the 12-for-1 trade a hand move.') ],
      L: {
        '4.10.02': [T('ruler', { u: 'yd', a: 0, b: 27, len: 27 }, 'How long is the ribbon in inches? In feet and inches?', '')],
        '4.10.03': [T('scale', { m: 'dial', u: 'lb', mx: 5, tk: 2, w: 38 }, 'Read the scale in pounds and ounces.', '1 lb = 16 oz.')],
        '4.10.04': [T('beaker', { u: 'qt', mx: 4, tk: 0.5, a0: 3 }, 'How many quarts? How many cups is that?', '')],
        '4.10.05': [T('clock', { t: 615, el: 1, st: 540 }, 'How much time has passed?', '')],
        '4.10.06': [T('ruler', { u: 'in', q: 4, a: 0, b: 4.5, len: 4.5 }, 'How long is the ribbon? What fraction of a foot is it?', '')]
      } },
    '4.11': { name: 'Area and Perimeter', tools: [
      T('tiles', { cols: 10, rows: 8, unit: 'cm', cells: RECT(6, 4) }, 'Count the tiles. Then find a faster way.', 'Rows × columns leads to length × width.'),
      T('geoboard', { n: 11 }, 'Make a rectangle with an area of 12 square units.', ''),
      T('whiteboard', { bg: 'grid' }, 'Draw the shape and label each side.', '') ],
      L: {
        '4.11.03': [T('tiles', { cols: 12, rows: 8, unit: 'm', cells: Object.assign(RECT(6, 3), RECT(3, 3, 0, 3)) }, 'Split the shape into two rectangles. Add their areas.', '')],
        '4.11.04': [T('tiles', { cols: 12, rows: 8, edge: true, unit: 'm' }, 'Lay tiles to make a rectangle. Count the edges around it.', '')],
        '4.11.05': [T('tiles', { cols: 12, rows: 8, edge: true, unit: 'cm' }, 'Make two rectangles with a perimeter of 16 cm. Are their areas the same?', 'Same perimeter, different area.')]
      } },
    '4.12': { name: 'Decimals', tools: [
      T('decgrid', { m: 'h', c: 1 }, 'Shade 35 hundredths. Write it as a decimal and as a fraction.', ''),
      T('discs', { hi: 1, lo: -2, c: { 0: 1, '-1': 3, '-2': 5 } }, 'What number do the discs show? Break a tenth into hundredths.', '10-value discs with tenths and hundredths.'),
      T('numberline', { a: 0, b: 1, parts: 10, mode: 'dec', lab: 'ends' }, 'Name every mark between 0 and 1.', '') ],
      L: {
        '4.12.01': [T('decgrid', { m: 't', c: 2 }, 'Shade 1 and 3 tenths.', '')],
        '4.12.02': [T('numberline', { a: 2, b: 3, parts: 10, mode: 'dec', lab: 'ends' }, 'Put a dot on 2.6.', '')],
        '4.12.05': [T('fbars', { d: [2, 4, 5, 10], lab: 1 }, 'Line up 1 fifth with tenths. How many tenths match?', '')],
        '4.12.07': [T('decgrid', { m: 'h', c: 2 }, 'Shade 0.4 on one grid and 0.38 on the other. Which is more?', '')],
        '4.12.08': [T('numberline', { a: 3, b: 4, parts: 10, mode: 'dec', lab: 'ends' }, 'Round 3.68 to the nearest tenth and whole number.', '')]
      } },
    '4.13': { name: 'Adding and Subtracting Decimals', tools: [
      T('discs', { hi: 1, lo: -2, c: { 0: 2, '-1': 7, '-2': 4 } }, 'Add or take away with discs. Trade 10 tenths for 1 one.', ''),
      T('decgrid', { m: 'h', c: 2 }, 'Shade the first number, then the second. How much in all?', ''),
      T('money', { mode: 'count' }, 'Make $3.45 with the fewest coins and bills.', '') ],
      L: {
        '4.13.05': [T('discs', { hi: 0, lo: -2, c: { 0: 1 } }, 'Take away 0.35 from 1. Break the one first.', '')],
        '4.13.07': [T('money', { mode: 'change', pr: 3.65, pd: 5 }, 'Count up from the price to $5.00 to make change.', '')]
      } },
    '4.14': { name: 'Multiplying and Dividing Decimals', tools: [
      T('discs', { hi: 1, lo: -2, c: { '-1': 3 } }, 'Make 0.3 four times. Trade when you can.', ''),
      T('money', { mode: 'count' }, 'Show 4 groups of $1.25. How much in all?', ''),
      T('decgrid', { m: 'h', c: 3 }, 'Shade 0.6 three times.', '') ],
      L: {
        '4.14.04': [T('discs', { hi: 0, lo: -2, c: { '-1': 8, '-2': 4 } }, 'Share 0.84 into 4 groups.', '')],
        '4.14.05': [T('discs', { hi: 1, lo: -2, c: { 0: 5, '-1': 2 } }, 'Share 5.2 into 4 groups. Break the leftover one into tenths.', '')]
      } },
    '4.15': { name: 'Angles', tools: [
      T('protractor', { target: '' }, 'Make a few angles. Which are smaller than a right angle?', ''),
      T('geoboard', { n: 11, mode: 'line' }, 'Make an acute, a right and an obtuse angle.', '') ],
      L: {
        '4.15.01': [T('protractor', { show: false }, 'Make an angle. Guess its size before you show the protractor.', 'Estimate first, then measure.'), T('clock', { t: 180, dg: 0 }, 'Turn the long hand a quarter turn. How many degrees is that?', '')],
        '4.15.02': [T('protractor', { target: '135' }, 'Make an angle of 135°.', 'Which scale starts at 0 on the arm?')],
        '4.15.03': [T('protractor', { target: '70' }, 'Draw a 70° angle.', '')],
        '4.15.04': [T('protractor', { three: true, a: 40, c: 115 }, 'Find both parts and the whole angle.', 'Angle measure is additive.')],
        '4.15.05': [T('protractor', { full: true, a: 250 }, 'How big is the reflex angle? Use 360° to check.', '')]
      } },
    '4.16': { name: 'Lines and Shapes', tools: [
      T('setsquare', { mode: 'draw' }, 'Draw a pair of perpendicular lines with the triangle.', ''),
      T('geoboard', { n: 11 }, 'Make a shape with one pair of parallel sides.', ''),
      T('pattern', { mirror: 'v' }, 'Build a design that matches on both sides of the line.', '') ],
      L: {
        '4.16.02': [T('setsquare', { mode: 'move', sel: 's30' }, 'Slide the triangle along the ruler and draw two parallel lines.', '')],
        '4.16.04': [T('geoboard', { n: 11 }, 'Make a trapezoid, a parallelogram and a rhombus.', ''), T('tangram', { pz: 'rect3' }, 'Make the rectangle. Which pieces are quadrilaterals?', '')],
        '4.16.05': [T('geoboard', { mirror: 'v', bands: [{ p: [[1, 2], [4, 2], [4, 6]], k: 1, c: 1 }] }, 'Reflect the shape over the line. Check it.', '')],
        '4.16.06': [T('pattern', { mirror: 'v' }, 'Make a pattern that is symmetric.', '')]
      } },
    '4.17': { name: 'Cuboids', tools: [
      T('cubes', { n: 5, h: BOX(3, 2, 2) }, 'How many faces, edges and corners does the box have?', ''),
      T('whiteboard', { bg: 'grid' }, 'Draw a net for the box on the grid.', 'Cut out the net on paper and fold it.') ],
      L: {
        '4.17.01': [T('cubes', { n: 5, L: 3, W: 2, H: 2 }, 'Tap Build it. Turn the box to see every face.', '')]
      } },

    /* ═════════ GRADE 5 ═════════ */
    '5.01': { name: 'Whole Numbers and Powers of 10', tools: [
      T('discs', { hi: 6, lo: 0, c: { 1: 3, 0: 4 } }, 'Make 34 ten times. Trade until you can’t. What number is it?', 'Every disc moves one place to the left when you multiply by 10.'),
      T('pvcards', { n: '3400' }, 'Pull the cards apart. Compare 34 and 3,400.', '') ] },
    '5.02': { name: 'Expressions and Order of Operations', tools: [
      T('bar', BAR([R('', '?', 'above', [['', '', 1], ['', '', 1], ['', '', 1], ['', '', 2]])]), 'Draw the story. Which part do you find first?', 'Bar models show why parentheses matter.'),
      T('counters', { mode: 'array', r: 3, c: 8, split: 5 }, 'Write two expressions for this array.', ''),
      T('whiteboard', { bg: 'lined' }, 'Show each step on its own line.', '') ] },
    '5.03': { name: 'Multiplication and Division', tools: [
      T('discs', { hi: 4, lo: 0, c: { 2: 1, 1: 4, 0: 4 } }, 'Use discs to share 144 into 12 groups.', ''),
      T('whiteboard', { bg: 'grid' }, 'Line up digits in the grid squares.', ''),
      T('numberline', { a: 0, b: 1000, parts: 10, mode: 'whole', lab: 'ends' }, 'Estimate first. Round the numbers on the line.', '') ] },
    '5.04': { name: 'Adding and Subtracting Fractions', tools: [
      T('fbars', { d: [2, 3, 4, 6, 8, 12], w: 2, lab: 1 }, 'Add 1 half and 1 third. Find a row where both line up.', ''),
      T('fcircles', { c: 2, per: 1, ns: [3, 4, 4, 4] }, 'Shade 2 thirds and 1 fourth. Which slices could match both?', ''),
      T('numberline', { a: 0, b: 1, parts: 3, mode: 'frac', two: 1, parts2: 12 }, 'Find twelfths that match the thirds.', '') ],
      L: { '5.04.01': [T('fcircles', { c: 3, n: 4 }, 'Share 3 circles among 4 people.', '')] } },
    '5.05': { name: 'Multiplying Fractions', tools: [
      T('fbars', { d: [2, 3, 4, 6, 12], lab: 1 }, 'Find 1 half of 2 thirds.', ''),
      T('tiles', { cols: 4, rows: 3 }, 'Shade 3 columns in one color. Shade 2 rows in another. Which squares have both?', 'Area model for fraction × fraction.'),
      T('bar', BAR([R('', '?', 'above', [['', '', 2], ['', '', 2], ['', '', 0]])]), 'Draw the fraction of an amount with units.', '') ] },
    '5.06': { name: 'Dividing Fractions', tools: [
      T('fbars', { d: [2, 3, 4, 6], w: 3, lab: 1 }, 'How many thirds fit in 2 wholes?', ''),
      T('numberline', { a: 0, b: 3, parts: 9, mode: 'mixed', lab: 'ends', hop: 1 }, 'Hop by thirds from 0 to 3. How many hops?', ''),
      T('bar', BAR([R('', '?', 'above', 4)]), 'Split one part into equal units.', '') ] },
    '5.07': { name: 'Fractions, Measurement and Area', tools: [
      T('tiles', { cols: 10, rows: 8 }, 'Find the area of the rectangle.', ''),
      T('geoboard', { n: 11, bands: [{ p: [[1, 7], [7, 7], [1, 3]], k: 1, c: 0 }] }, 'Find the area of the triangle. Make a rectangle around it.', 'A triangle is half of a rectangle.'),
      T('ruler', { u: 'in', q: 4, a: 0, b: 6.75, len: 6.75 }, 'Measure the ribbon to the nearest quarter inch.', '') ] },
    '5.08': { name: 'Volume', tools: [
      T('cubes', { L: 4, W: 3, H: 2, h: BOX(4, 3, 2), cm: true, lay: true }, 'Count the cubes in one layer. How many layers?', 'Layers lead to length × width × height.'),
      T('beaker', { u: 'ml', mx: 1000, tk: 100, a0: 1000 }, 'A 1-liter cube holds 1,000 mL. That is 1,000 cubic centimeters.', '') ],
      L: { '5.08.04': [T('cubes', { n: 6, h: Object.assign(BOX(4, 3, 2), { '0_0': 4, '1_0': 4 }) }, 'Split the shape into boxes. Add their volumes.', '')] } },
    '5.09': { name: 'Decimals to Thousandths', tools: [
      T('discs', { hi: 1, lo: -3, c: { 0: 2, '-1': 4, '-3': 7 } }, 'What number do the discs show? Which place is empty?', ''),
      T('decgrid', { m: 'th' }, 'Shade 0.125.', ''),
      T('numberline', { a: 0.1, b: 0.2, parts: 10, mode: 'dec', lab: 'ends' }, 'Name the thousandths between 0.1 and 0.2.', '') ],
      L: { '5.09.07': [T('ruler', { u: 'm', a: 0, b: 64, len: 64 }, 'Write the length in meters as a decimal.', '')] } },
    '5.10': { name: 'Decimal Operations', tools: [
      T('discs', { hi: 1, lo: -3, c: { 0: 1, '-1': 2, '-2': 5 } }, 'Add or take away with discs. Trade when you need to.', ''),
      T('decgrid', { m: 'h', c: 3 }, 'Show 0.3 × 4 on the grids.', ''),
      T('money', { mode: 'count' }, 'Show $1.25 four times.', '') ] },
    '5.11': { name: 'Geometry', tools: [
      T('protractor', { target: '' }, 'Measure each angle of your triangle. Add them.', ''),
      T('geoboard', { n: 11 }, 'Make an isosceles triangle and a scalene triangle.', ''),
      T('setsquare', { mode: 'draw' }, 'Draw a parallelogram with the ruler and triangle.', '') ],
      L: { '5.11.04': [T('protractor', { three: true, a: 60, c: 110 }, 'Can the three angles of a triangle add to more than 180°?', '')] } },
    '5.12': { name: 'Data and Graphs', tools: [
      T('bar', BAR([R('A', '', 'above', [['8', '8', 1]]), R('B', '', 'above', [['4', '4', 2]]), R('C', '', 'above', [['6', '6', 3]])]), 'Make all the bars the same length. That is the average.', 'Average = leveling the bars.'),
      T('numberline', { a: 0, b: 2, parts: 8, mode: 'mixed', lab: 'all' }, 'Use the line as a line plot.', ''),
      T('whiteboard', { bg: 'grid' }, 'Draw the axes and plot the points.', '') ] },
    '5.13': { name: 'Ratio', tools: [
      T('bar', BAR([R('Red', '', 'above', 2), R('Blue', '', 'above', 3)]), 'The ratio is 2 to 3. If 1 unit is 6, how many of each?', ''),
      T('counters', { mode: 'array', r: 2, c: 5, flip: ['0,0', '0,1', '1,0', '1,1'] }, 'Write the ratio of yellow to red.', '') ] },
    '5.14': { name: 'Rate', tools: [
      T('bar', BAR([R('1 hour', '60 km', 'above', 1), R('3 hours', '?', 'above', 3)]), 'Find the distance for 3 hours.', ''),
      T('numberline', { a: 0, b: 300, parts: 6, mode: 'whole', lab: 'all', two: 1, parts2: 6 }, 'Use one line for time and one for distance.', 'Double number line.'),
      T('clock', { t: 540, el: 1, st: 480 }, 'How much time passed? How far at 60 km each hour?', '') ] },
    '5.15': { name: 'Percentage', tools: [
      T('decgrid', { m: 'h', pct: 1 }, 'Shade 35 squares. What percent is that?', ''),
      T('bar', BAR([R('100%', '?', 'above', 10)]), 'Each unit is 10%. Shade 30%.', ''),
      T('money', { mode: 'count' }, 'What percent of a dollar is a quarter?', '') ] }
  };

  /* build lesson records */
  var unitNames = {};

  /* ───── Goals (✓ + mistake hints) and hands-on extras. These go FIRST for the lesson, so the goal tool is the main tool. ───── */
  var FIRST = {
    '3.01.01': [T('blocks', { c: {} }, 'Build 1,234 with blocks.', 'Students build from the biggest block down.', ['Build 1,234 with blocks.', '1234', [['1243', 'Check the tens and ones. 1,234 has 3 tens and 4 ones.']]])],
    '3.01.02': [T('discs', { hi: 3, lo: 0, c: {} }, 'Build 4,072 with discs.', 'The empty hundreds column is the point: we still write the 0.', ['Build 4,072.', '4072', [['472', 'Look at the thousands. 4,072 starts with 4 thousands.'], ['4720', 'Check the tens and ones. 4,072 has 7 tens and 2 ones.'], ['4702', 'Check the tens. 4,072 has 7 tens and 0 hundreds.']]])],
    '3.03.01': [T('discs', { hi: 3, lo: 0, c: { 2: 4, 1: 7, 0: 8 } }, 'The mat shows 478. Add 365, then trade until no column has 10 or more.', 'The answer is right only after every trade is made.', ['Add 365 and make every trade.', '0,8,4,3', [['0,7,13,13', 'Look at the ones: 13 ones. Drag one up to trade 10 ones for 1 ten.'], ['0,7,14,3', 'Look at the tens: 14 tens. Drag one up to trade 10 tens for 1 hundred.'], ['0,8,3,13', 'Look at the ones: 13 ones. Trade 10 of them for 1 ten.']], 'places'])],
    '3.03.02': [T('discs', { hi: 2, lo: 0, c: { 2: 5, 1: 2, 0: 3 } }, 'Take away 168 from 523. Break a disc when you don’t have enough.', 'Students break a ten, then a hundred, before they subtract.', ['Take away 168.', '355', [['691', 'You added. Drag 168 off the mat instead.']]])],
    '3.03.03': [T('discs', { hi: 3, lo: 0, c: { 3: 1 } }, 'Take away 1 from 1,000. Break one disc at a time.', 'Subtracting across zeros: break 1,000 → 10 hundreds → 9 hundreds 10 tens, and so on.', ['Take away 1.', '999'])],
    '3.04.05': [T('counters', { mode: 'share', n: 14, g: 3 }, 'Share 14 counters into 3 equal groups. How many are left over?', 'The remainder must be less than the number of groups.', ['Share 14 into 3 equal groups.', '4'])],
    '3.09.01': [T('fcircles', { c: 1, n: 4 }, 'Shade 3 fourths of the circle.', 'Equal parts first.', ['Shade 3 fourths.', '3/4', [['1/4', 'That is 1 fourth. Shade 2 more slices.'], ['1', 'That is the whole circle. Take one slice away.']]])],
    '3.10.06': [T('fbars', { bm: 'build', d: [5], bt: [] }, 'Build 2 fifths, then add 2 more fifths.', 'Add like fractions by counting unit fractions.', ['Show 2 fifths + 2 fifths.', '4/5'])],
    '3.11.02': [T('trademat', { u: 'mcm', b0: 1, s0: 0, b: 1, sp: [0, 0], take: 1, tb: 0, ts: 64, zb: 0, zp: [0, 0] }, 'Take 64 cm away from 1 m. Break the meter first.', 'Breaking 1 m into 100 cm is the key move.', ['Take away 64 cm.', '36'])],
    '3.11.04': [T('trademat', { u: 'kmm', b0: 1, s0: 0, take: 1, tb: 0, ts: 375 }, 'Take 375 m away from 1 km.', '1 km = 1,000 m.', ['Take away 375 m.', '625'])],
    '3.12.07': [T('compass', { r: 2 }, 'Open the compass to 4 cm and draw a circle.', 'Practice on screen, then with the safety compass.', ['Draw a circle with a 4 cm radius.', '4', [['8', 'That is the diameter. The radius is half as long.']]])],
    '4.01.01': [T('discs', { hi: 5, lo: 0, c: {} }, 'Build 230,406 with discs.', 'Read the thousands period, then the ones period.', ['Build 230,406.', '230406', [['23406', 'Look at the ten thousands. 230,406 has 3 ten thousands and 0 thousands.'], ['234060', 'Check each column against the number, one place at a time.']]])],
    '4.06.01': [T('fbars', { bm: 'build', d: [6], bt: [] }, 'Use sixth tiles to make the same amount as 2 thirds.', 'Build it, then line it up against thirds.', ['Make 2 thirds out of sixths.', '2/3', [['1/2', 'That is 3 sixths. Line it up with 2 thirds. Is it as long?']]])],
    '4.07.01': [T('fbars', { bm: 'build', d: [8], bt: [] }, 'Build 3 eighths, then add 4 more eighths.', '', ['Show 3 eighths + 4 eighths.', '7/8', [['7/16', 'Eighths stay eighths. Count the tiles: how many eighths?']]])],
    '4.10.01': [T('trademat', { u: 'mcm', b0: 2, s0: 35, take: 0 }, 'Add 1 m 80 cm to the mat. Then trade 100 cm for 1 m.', 'Two-unit adding with a trade.', ['Add 1 m 80 cm and trade.', '4', [['3', 'You have 115 cm. That is more than 1 m. Trade 100 cm for 1 m.']], 'b'])],
    '4.10.02': [T('trademat', { u: 'ftin', b0: 5, s0: 1, b: 5, sp: [1], take: 1, tb: 2, ts: 6 }, 'Take 2 ft 6 in away from 5 ft 1 in.', 'Break a foot into 12 inches when the inches run out.', ['Take away 2 ft 6 in.', '31', [['37', 'Look in the box. It should hold 2 ft and 6 in.']]]),
                T('barstrip', { mode: 'fill', whole: 12, wl: '1 ft', piece: 1, unit: 'in', hide: 1 }, 'How many inches fill 1 foot?', '', ['Fill the foot with inches.', '12'])],
    '4.10.03': [T('trademat', { u: 'lboz', b0: 3, s0: 4, b: 3, sp: [4], take: 1, tb: 1, ts: 9 }, 'Take 1 lb 9 oz away from 3 lb 4 oz.', '1 lb = 16 oz.', ['Take away 1 lb 9 oz.', '27'])],
    '4.10.04': [T('trademat', { u: 'galqt', b0: 2, s0: 1, take: 0 }, 'Add 1 gal 3 qt. Then trade 4 quarts for 1 gallon.', '1 gal = 4 qt.', ['Add 1 gal 3 qt and trade.', '4', [['3', 'You have 4 quarts or more. Trade 4 quarts for 1 gallon.']], 'b'])],
    '4.10.05': [T('trademat', { u: 'hmin', b0: 1, s0: 40, take: 0 }, 'Add 35 minutes. Then trade 60 minutes for 1 hour.', '1 h = 60 min.', ['Add 35 min and trade.', '2', [['1', 'You have 60 minutes or more. Trade them for 1 hour.']], 'b'])],
    '4.10.06': [T('barstrip', { mode: 'fill', whole: 12, wl: '1 ft', piece: 3, pl: '3 in', unit: 'in', hide: 1 }, 'How many 3-inch pieces fill 1 foot? So 3 inches is what fraction of a foot?', '', ['Fill the foot with 3-inch pieces.', '4'])],
    '4.11.01': [T('tiles', { cols: 10, rows: 8, unit: 'cm' }, 'Make a rectangle 6 tiles long and 4 tiles wide.', 'Rows × columns leads to length × width.', ['Make a 6 by 4 rectangle.', '24'])],
    '4.11.04': [T('tiles', { cols: 12, rows: 8, edge: true, unit: 'm' }, 'Make a rectangle with a perimeter of 14 m.', '', ['Make a perimeter of 14 m.', '14', [], 'p'])],
    '4.12.03': [T('decgrid', { m: 'h', c: 1 }, 'Shade 0.35 of the grid.', 'Tenths are columns, hundredths are squares.', ['Shade 0.35.', '0.35', [['0.53', 'Look at the columns. 0.35 is 3 tenths (columns) and 5 hundredths (squares).'], ['3.5', 'One whole grid is 1. Is 0.35 more than a whole?']]])],
    '4.15.02': [T('protractor', { target: '135' }, 'Make an angle of 135°.', 'Which scale starts at 0 on the arm?', ['Make 135°.', '135', [['45', 'You read the other scale. Start at 0 on the bottom arm and count up.']]])],
    '4.15.03': [T('protractor', { target: '70' }, 'Draw a 70° angle.', '', ['Make 70°.', '70', [['110', 'You read the other scale. Start at 0 on the bottom arm.']]])],
    '5.08.02': [T('cubes', { n: 6, cm: true }, 'Build a box 4 cubes long, 3 wide and 2 high.', 'Layers lead to length × width × height.', ['Build a 4 by 3 by 2 box.', '24', [['12', 'That is one layer. How many layers high is the box?']]])],
    '5.09.01': [T('decgrid', { m: 'th' }, 'Shade 0.125 of the grid.', '', ['Shade 0.125.', '0.125', [['0.25', 'Look at the thousandths. 0.125 has 1 tenth, 2 hundredths and 5 thousandths.']]])]
  };
  /* tools whose readout would give away an answer the Try this asks for */
  var READOUT = { discs: 1, pvcards: 1, blocks: 1, numberline: 1, counters: 1, fbars: 1, fcircles: 1, decgrid: 1, money: 1, ruler: 1, scale: 1, beaker: 1, clock: 1, tiles: 1, geoboard: 1, protractor: 1, compass: 1, cubes: 1, trademat: 1, barstrip: 1, pattern: 1 };
  /* Open manipulatives: a lesson tag only picks the tool and how it is set up (places, units, rows),
     never a problem, a goal, a starting amount or hidden totals. Students get a clean tool for any problem. */
  var CONFIG = {
    discs: ['hi', 'lo', 'cap'], pvcards: [], blocks: [], bond: ['parts', 'dir'], bar: [],
    numberline: ['a', 'b', 'parts', 'mode', 'lab', 'two', 'parts2', 'simp'], counters: ['mode', 'r', 'c', 'n', 'g'],
    hundred: ['mode', 'start'], dice: ['mode', 'k', 'sides', 'op', 'lo', 'hi'],
    fbars: ['d', 'w', 'lab', 'bm'], fcircles: ['c', 'n', 'per', 'ns', 'lab'], decgrid: ['m', 'c', 'pct'], money: [],
    ruler: ['u', 'q'], scale: ['m', 'u', 'mx', 'tk'], beaker: ['u', 'mx', 'tk', 'c'], clock: ['sn', 'dg', 'el', 'tmr'],
    trademat: ['u'], barstrip: ['mode', 'unit', 'whole', 'wl', 'piece', 'pl', 'p2', 'p2l'],
    tiles: ['cols', 'rows', 'unit', 'edge'], geoboard: ['n', 'mode', 'mirror'], whiteboard: ['bg'], tangram: ['pz'],
    pattern: ['frac', 'mirror'], protractor: ['full', 'three', 'show'], setsquare: ['mode'], compass: [], cubes: ['n', 'cm']
  };
  var EMPTY = { discs: { c: {} }, trademat: { b0: 0, s0: 0, b: 0, sp: [0, 0, 0], take: 0 }, bond: { w: '', p: ['', '', '', ''] } };
  function finish(t) {
    var p = {}, src = t.p || {};
    (CONFIG[t.t] || []).forEach(function (k) { if (src[k] !== undefined) p[k] = src[k]; });
    if (EMPTY[t.t]) Object.assign(p, EMPTY[t.t]);
    return { t: t.t, p: Object.keys(p).length ? p : null, idea: t.s, tip: t.tip };
  }

  LESSONS.forEach(function (x) {
    var id = x[0], g = +id[0], uid = id.slice(0, 4), u = U[uid] || { name: 'Unit ' + uid.slice(2), tools: [] };
    var extra = (FIRST[id] || []).concat((u.L && u.L[id]) || []), have = {}, list = [];
    extra.forEach(function (t) { if (!have[t.t]) { have[t.t] = 1; list.push(t); } });
    u.tools.forEach(function (t) { if (!have[t.t]) list.push(t); });
    lessons.push({ id: id, g: g, unit: uid, unitName: u.name, title: x[1], file: x[2], url: base[g] + x[2], tools: list.slice(0, 3).map(finish) });
    units[uid] = { id: uid, g: g, name: u.name };
  });

  var api = { tools: tools, groups: groups, base: base, units: units, lessons: lessons,
    lessonById: function (id) { id = String(id).trim(); return lessons.filter(function (l) { return l.id === id; })[0]; } };
  return api;
})();
