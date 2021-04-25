var department_circ = circleGen([850, 250], 45);

var cat_circ = circleGen([850, 425], 80);

var stat_135_circ = circleGen([350, 300], 200)
var stat_135_circ2 = circleGen([350, 300], 125)
var stat_134_circ = circleGen([55, 250], 150)
var math_1a_circ = circleGen([0, 0], 125)
var math_1a_circ2 = circleGen([0, 0], 250)
var math_1b_circ = circleGen(math_1a_circ(-4/8), 125)
var math_1b_circ2 = circleGen(math_1a_circ(-4/8), 225)
var math_1b_circ3 = circleGen(math_1a_circ(-4/8), 175)
var data_c8_circ = circleGen([425, 50], 175)
var data_c8_circ2 = circleGen([425, 50], 150)
var data_c100_circ = circleGen(data_c8_circ(-7/16), 175)
var data_c100_circ2 = circleGen(data_c8_circ(-7/16), 200)
var elective_circ = circleGen([400, 75], 600)

var deps = [
  new Department("Statistics", department_circ(1/2), "Pinkish"),
  new Department("Data", department_circ(7/6), "Purple"),
  new Department("Math", department_circ(-1/6), "GrassGreen")
]

var cats = [
  new Category("Lower Div Req", cat_circ(1/4)),
  new Category("Core Class", cat_circ(3/4)),
  new Category("Elective", cat_circ(5/4)),
  new Category("Programming", cat_circ(7/4))
]

var els = [
  new Element("1A", [], ["C131A", "1B", "20", "88"], [], [0, 0], ["Lower Div Req"], "Math"),
  new Element("1B", ["1A"], ["89A","53", "54", "55", "134", "C140"], ["20"], math_1a_circ(-6/8), ["Lower Div Req"], "Math"),
  new Element("53", ["1B"], ["134", "C140", "154"], ["134", "C140"], math_1b_circ(13/8), ["Lower Div Req"], "Math"),
  new Element("54", ["1B"], ["Linear Algebra"], [], math_1b_circ(15/8), ["Lower Div Req"], "Math"),
  new Element("55", ["1B"], ["154"], ["154"], math_1b_circ3(10.5/8), [], "Math"),
  new Element("C8", [], ["C131A", "89A","C100", "C140", "88"], [], [425, 25], ["Lower Div Req"], "Data"),
  new Element("20", ["1A"], ["C131A", "C140"], [], math_1a_circ2(0), ["Lower Div Req"], "Statistics"),
  new Element("33A", [], ["C131A"], ["C131A"], [750, 0], ["Programming"], "Statistics"),
  new Element("33B", ["61A"], [], [], [750, 100], ["Programming", "Core Class"], "Statistics"),
  new Element("61A", [], ["C100", "33B", "C140"], [], [600, 0], ["Programming"]),
  new Element("88", ["1A", "C8"], ["C8"], [], data_c8_circ2(5/4), [], "Statistics"),
  new Element("89A", ["1B", "C8"], ["Linear Algebra", "C8"], ["C8"], math_1b_circ(16.5/8), [], "Statistics"),
  new Element("C100", ["61A", "C8", "Linear Algebra"], ["C102", "C140", "Linear Algebra"], [], data_c8_circ(-7/16), ["Core Class"], "Data"),
  new Element("C102", ["C100", "Linear Algebra", "Upper Division Probability"], ["151A"], [], data_c100_circ(12.5/8), ["Elective"], "Data"),
  new Element("C131A", ["33A", "133", "C8", "20", "1A"], ["33A", "133"], ["33A", "133"], data_c8_circ(-3/16), [], "Data"),
  new Element("133", [], ["C131A", "159", "151A", "152", "153", "158", "135"], ["C131A", "158", "152", "151A", "153","135"], [575, 500], ["Programming", "Core Class"], "Statistics"),
  new Element("134", ["53", "1B"], ["Upper Division Probability"], [], math_1b_circ2(12/8), ["Lower Div Req", "Core Class"], "Statistics"),
  new Element("135", ["Linear Algebra", "Upper Division Probability", "133"], ["151A", "152", "153", "154", "156", "157", "158", "159", "133"], ["152", "153", "133"], [325, 500], ["Lower Div Req", "Core Class"], "Statistics"),
  new Element("C140", ["Linear Algebra", "53", "C8", "C100", "20", "61A", "1B"], ["Upper Division Probability", "Linear Algebra"], [], data_c100_circ2(9.5/8), ["Lower Div Req", "Core Class"], "Data"),
  new Element("150", ["Upper Division Probability"], [], [], elective_circ(9.7/8), ["Elective"], "Statistics"),
  new Element("151A", ["135", "C102", "133"], [], [], elective_circ(11.7/8), ["Elective"], "Statistics"),
  new Element("152", ["135", "133", "Upper Division Probability"], [], [], elective_circ(10.9/8), ["Elective"], "Statistics"),
  new Element("153", ["Upper Division Probability", "133", "135"], [], [], elective_circ(11.3/8), ["Elective"], "Statistics"),
  new Element("154", ["135", "53", "55"], [], [], elective_circ(10.5/8), ["Elective"], "Statistics"),
  new Element("155", ["Upper Division Probability"], [], [], elective_circ(10.1/8), ["Elective"], "Statistics"),
  new Element("156", ["135"], [], [], elective_circ(12.1/8), ["Elective"], "Statistics"),
  new Element("157", ["135"], [], [], elective_circ(12.5/8), ["Elective"], "Statistics"),
  new Element("158", ["135", "133"], ["135"], [], elective_circ(12.9/8), ["Elective"], "Statistics"),
  new Element("159", ["135", "133"], [], [], elective_circ(13.3/8), ["Elective"], "Statistics"),
  new Articulation("Upper Division Probability", ["134", "C140"], ["135", "150", "155", "C102", "152", "153"], [], [175, 400]),
  new Articulation("Linear Algebra", ["54", "89A"], ["135", "C100", "C102", "C140"], [], math_1b_circ2(15/8))
]
