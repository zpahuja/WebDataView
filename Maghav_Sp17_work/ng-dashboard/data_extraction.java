
/* this is a simple crawler for NCPRE dept. I don't think u need to worry about this file */
package web_scraping;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jsoup.Jsoup;
import org.jsoup.nodes.*;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class data_extraction {

	// global variable
	static String[] chosen_rows = { "item1340", "item1360", "item1380",
			"item1320", "item1803", "item1804", "item1805", "item1806",
			"item1743", "item1744", "item1745", "item1746", "item1400",
			"item1410", "item1420", "item1424", "item1440", "item1630",
			"item1635", "item3660", "item3771", "item3777", "item3781",
			"item3688", "item3840", "item3920", "item3925", "item3940",
			"item3952", "item4312", "item4315", "item4332", "item4334",
			"item5200", "item6180", "item6220", "item6230", "item6240",
			"item5700", "item5710", "item5720", "item4720", "item4740",
			"item4760", "item4420", "item4430", "item4450", "item4460",
			"item4810", "item4820", "item4840", "item2770", "item2772",
			"item2690" };
	static String[] chosen_row_names = { "professor", "associate professor",
			"assistant professor", "all tenured faculty",
			"underrepresented faculty all", "underrepresented professors",
			"underrepresented associate professors",
			"underrepresented assistant professors",
			"women all tenure track faculty", "women professors",
			"wemon associate professors", "wemen assistant professors",
			"visiting faculty", "post-docs faculty", "other instructors",
			"clinical faculty", "academic professionals",
			"graduate assistants", "civil service", "undergrads",
			"non-resident undergrads", "underrepresented undergrads",
			"international undergrads", "women undergrads",
			"graduate students", "non-resident graduate students",
			"underrepresented graduate students",
			"international graduate students", "women graduate students",
			"ACT", "high school ranking", "undergrad-faculty fte",
			"grad-faculty fte", "credit hours",
			"credit hours per tenure faculty",
			"% class taught by tenured faculty",
			"% class taught by graduate students", "% class taught by other",
			"% credit hours taught to stundets in this department",
			"% credit hours taught to students in this college",
			"% credit hours taught to students in other colleges",
			"Bachelors TTD(time to degree)", "Masters TTD(time to degree)",
			"Doctoral TTD(time to degree)", "bachelors degrees awarded",
			"masters degrees awarded", "professional degrees awarded",
			"doctoral degrees awarded", "bachelors per tenured faculty",
			"masters/prof degree per tenured faculty",
			"doctoral degree per tenured faculty", "sponsored research",
			"sponsored research per tenure track facult", "icr" };
	static String[] year = { "2014/15", "2013/14", "2012/13", "2011/12",
			"2010/11", "2009/10", "2008/09", "2007/08", "2006/07", "2005/06" };
	static WebDriver NCPRE = null;
	static Select dept_select = null;
	static WebElement dept = null;
	static List<String> dept_val = new ArrayList<>();
	static Document NCPRE_doc = null;
	static FileOutputStream output = null;
	static Workbook NCPRE_workbook = null;
	static Row[] excel_row = new Row[1000];
	static Sheet excel_sheet = null;
	static int col_counter = 0;
	static int row_counter = 0;

	public static void find_all() {
		dept = NCPRE.findElement(By.id("Main_DropDownUnits"));
		dept_select = new Select(dept);
	}

	public static void excel_prep() {
		int i = 0;
		excel_sheet = NCPRE_workbook.createSheet(WorkbookUtil
				.createSafeSheetName("NCPRE"));
		excel_row[row_counter] = excel_sheet.createRow(row_counter);
		row_counter++;
		int counter = 1;
		for (i = 0; i < chosen_row_names.length; i++) {
			for (int j = 0; j < year.length; j++) {
				excel_row[0].createCell(counter).setCellValue(
						year[j] + " " + chosen_row_names[i]);
				counter++;
			}

			if (chosen_row_names[i] == "clinical faculty") {
				for (int j = 0; j < year.length; j++) {
					excel_row[0].createCell(counter).setCellValue(
							year[j] + " " + "VPDO");
					counter++;
				}
			}

			if (chosen_row_names[i] == "credit hours per tenure faculty") {
				excel_row[0].createCell(counter).setCellValue(
						"5 year average credit hours taught");
				counter++;
			}

			if (chosen_row_names[i] == "sponsored research") {
				excel_row[0].createCell(counter).setCellValue(
						"sponsered research 5 year average");
				counter++;
			}

			if (chosen_row_names[i] == "sponsored research per tenure track facult") {
				excel_row[0].createCell(counter).setCellValue(
						"sponsered research per ts faculty 5 year average");
				counter++;
			}

			if (chosen_row_names[i] == "icr") {
				excel_row[0].createCell(counter).setCellValue(
						"icr 5 year average");
				counter++;
			}
		}
	}

	public static void create_spreadsheet() {
		Cell excel_cell = null;
		int counter = 0;
		int td_counter = 0;
		System.out.println(row_counter);
		for (counter = 0; counter < chosen_rows.length; counter++) {
			td_counter = 0;
			Elements tds = null;
			//System.out.println("counter = " + counter);
			try {
				tds = NCPRE_doc.getElementById(chosen_rows[counter]).select(
						"td");
				if (!tds.isEmpty()) {
					for (Element td : tds) {
						if (td_counter != 0 && td_counter != 1) {
							excel_cell = excel_row[row_counter]
									.createCell(col_counter);
							if(td.text() != null && !td.text().isEmpty())
								excel_cell.setCellValue(Double.parseDouble(td.text()));
							col_counter++;
						}
						td_counter++;
					}
				} else {
					col_counter += 10;
				}
			} catch (NullPointerException e) {
			//	System.out.println(chosen_rows[counter] + " not found");
				col_counter += 10;
			}

			if (chosen_row_names[counter] == "clinical faculty") {
				Elements tds_V = NCPRE_doc.getElementById("item1400").select(
						"td");
				Elements tds_P = NCPRE_doc.getElementById("item1410").select(
						"td");
				Elements tds_O = NCPRE_doc.getElementById("item1420").select(
						"td");
				double[] V = new double[10];
				double[] P = new double[10];
				double[] O = new double[10];
				int i = 0;
				try {
					for (Element td : tds_V) {
						if (i != 0 && i != 1) {
							if (td.text() != null && !td.text().isEmpty())
								V[i - 2] = Double.parseDouble(td.text());
							else
								V[i - 2] = 0;
						}

					}
				} catch (Exception e) {
					for (i = 0; i < 10; i++) {
						V[i] = 0;
					}
				}

				try {
					for (Element td : tds_P) {
						if (i != 0 && i != 1) {
							if (td.text() != null && !td.text().isEmpty())
								P[i - 2] = Double.parseDouble(td.text());
							else
								P[i - 2] = 0;
						}

					}
				} catch (Exception e) {
					for (i = 0; i < 10; i++) {
						P[i] = 0;
					}
				}

				try {
					for (Element td : tds_O) {
						if (i != 0 && i != 1) {
							if (td.text() != null && !td.text().isEmpty())
								O[i - 2] = Double.parseDouble(td.text());
							else
								O[i - 2] = 0;
						}
					}
				} catch (Exception e) {
					for (i = 0; i < 10; i++) {
						O[i] = 0;
					}
				}
				
				for (int j = 0; j < year.length; j++) {
					excel_row[row_counter].createCell(col_counter).setCellValue(
							V[j] + O[j] + P[j]);
					col_counter++;
				}
			}

			if (chosen_row_names[counter] == "credit hours per tenure faculty") {
				int i = 0;
				double result = 0;
				try {
					for (Element td : tds) {
						if (i == 2 || i == 3 || i == 4 || i == 5 || i == 6) {
							if (td.text() != null && !td.text().isEmpty())
								result += Double.parseDouble(td.text());
						}
					}
					excel_row[row_counter].createCell(col_counter).setCellValue(
							result / 5);
					col_counter++;
				} catch (Exception e) {
					col_counter++;
				}
			}

			if (chosen_row_names[counter] == "sponsored research") {
				int i = 0;
				double result = 0;
				try {
					for (Element td : tds) {
						if (i == 2 || i == 3 || i == 4 || i == 5 || i == 6) {
							if (td.text() != null && !td.text().isEmpty())
								result += Double.parseDouble(td.text());
						}
					}
					excel_row[row_counter].createCell(col_counter).setCellValue(
							result / 5);
					col_counter++;
				} catch (Exception e) {
					col_counter++;
				}
			}

			if (chosen_row_names[counter] == "sponsored research per tenure track facult") {
				int i = 0;
				double result = 0;
				try {
					for (Element td : tds) {
						if (i == 2 || i == 3 || i == 4 || i == 5 || i == 6) {
							if (td.text() != null && !td.text().isEmpty())
								result += Double.parseDouble(td.text());
						}
					}
					excel_row[row_counter].createCell(col_counter).setCellValue(
							result / 5);
					col_counter++;
				} catch (Exception e) {
					col_counter++;
				}
			}

			if (chosen_row_names[counter] == "icr") {
				int i = 0;
				double result = 0;
				try {
					for (Element td : tds) {
						if (i == 2 || i == 3 || i == 4 || i == 5 || i == 6) {
							if (td.text() != null && !td.text().isEmpty())
								result += Double.parseDouble(td.text());
						}
					}
					excel_row[row_counter].createCell(col_counter).setCellValue(
							result / 5);
					col_counter++;
				} catch (Exception e) {
					col_counter++;
				}
			}
		}
	}

	public static void data_execution(String op_val, String op_text) {
		boolean found = false;

		System.out.println(op_text);
		while (!found) {
			try {
				find_all();
				dept_select.selectByValue(op_val);
				found = true;
			} catch (StaleElementReferenceException e) {
			}
		}
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		NCPRE_doc = Jsoup.parse(NCPRE.getPageSource());
		create_spreadsheet();

	}

	public static void main(String[] args) {
		NCPRE = new FirefoxDriver();
		NCPRE_workbook = new XSSFWorkbook();

		NCPRE.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		NCPRE.get("http://dmi.illinois.edu/cp/default.aspx");
		System.out.println("NCPRE title is: " + NCPRE.getTitle());
		excel_prep();
		/*
		 * find_all(); dept_select.selectByValue("1B1-LQ-LQ0-411");
		 * Thread.sleep(1000);
		 */
		Elements dept_selection = Jsoup.parse(NCPRE.getPageSource())
				.getElementById("Main_DropDownUnits").select("option");

		for (Element option : dept_selection) {
			if (!option.val().equals("-1")) {
				try {
					excel_row[row_counter] = excel_sheet.createRow(row_counter);
					excel_row[row_counter].createCell(0).setCellValue(
							option.text());
					col_counter = 1;
					data_execution(option.val(), option.text());
					row_counter++;
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			System.out.println();
		}

		try {
			output = new FileOutputStream("NCPRE.xlsx");
			NCPRE_workbook.write(output);
			output.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		NCPRE.quit();

	}
}
