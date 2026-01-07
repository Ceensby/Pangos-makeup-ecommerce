package com.example.ecomm;

import com.example.ecomm.model.Product;
import com.example.ecomm.repository.ProductRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() > 0) {
            System.out.println("Database already seeded. Skipping...");
            return;
        }

        System.out.println("Starting Data Seeding from ProductsInfos.xlsx...");

        try (InputStream is = new ClassPathResource("ProductsInfos.xlsx").getInputStream();
                Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0); // Assume dictionary is in first sheet
            int processedCount = 0;
            int skippedCount = 0;

            // Iterate over columns
            // We need to determine the max column count.
            Row firstRow = sheet.getRow(0);
            if (firstRow == null) {
                System.out.println("Empty sheet!");
                return;
            }

            int maxCol = 0;
            for (Row row : sheet) {
                if (row.getLastCellNum() > maxCol) {
                    maxCol = row.getLastCellNum();
                }
            }

            System.out.println("Scanning " + maxCol + " columns for products...");

            for (int colIndex = 0; colIndex < maxCol; colIndex++) {
                Map<String, String> productData = new HashMap<>();

                // Scan rows for this column
                for (Row row : sheet) {
                    Cell cell = row.getCell(colIndex);
                    if (cell != null) {
                        String cellValue = getCellValueAsString(cell);
                        if (cellValue != null && cellValue.contains(":")) {
                            // Simple parser: "key": "value" or "key": value or key:value
                            // Cleaning up quotes and whitespace
                            String[] parts = cellValue.split(":", 2);
                            if (parts.length == 2) {
                                String key = parts[0].trim().replace("\"", "");
                                String value = parts[1].trim().replace("\"", "");
                                // Remove trailing comma if exists (common in json-like lists)
                                if (value.endsWith(",")) {
                                    value = value.substring(0, value.length() - 1);
                                }
                                productData.put(key, value);
                            }
                        }
                    }
                }

                if (isValidProduct(productData)) {
                    saveProduct(productData);
                    processedCount++;
                } else {
                    skippedCount++;
                }
            }

            System.out.println("Seeding completed.");
            System.out.println("Products Processed: " + processedCount);
            System.out.println("Columns Skipped (Spacer/Empty): " + skippedCount);

        } catch (Exception e) {
            System.err.println("Error reading Excel: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String getCellValueAsString(Cell cell) {
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue()); // Integer for IDs
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    private boolean isValidProduct(Map<String, String> data) {
        return data.containsKey("product_id") &&
                data.containsKey("name") &&
                !data.get("product_id").isEmpty() &&
                !data.get("name").isEmpty();
    }

    private void saveProduct(Map<String, String> data) {
        try {
            String name = data.get("name");
            String description = data.getOrDefault("description", "");
            Double price = 0.0;
            try {
                price = Double.valueOf(data.getOrDefault("price", "0"));
            } catch (NumberFormatException e) {
                System.out.println("Invalid price for " + name + ", defaulting to 0.");
            }
            String imageUrl = data.getOrDefault("image_url", "");
            boolean featured = Boolean.parseBoolean(data.getOrDefault("featured", "false"));
            String details = data.toString(); // Store all raw data in details just in case

            // Map Category
            String categoryId = data.getOrDefault("category_id", "0");
            CategoryMapping cat = mapCategory(categoryId);

            Product product = new Product(name, description, price, imageUrl, featured, details, cat.main, cat.sub);
            productRepository.save(product);

        } catch (Exception e) {
            System.err.println("Failed to save product: " + data.get("name"));
            e.printStackTrace();
        }
    }

    // Category Mapper
    private CategoryMapping mapCategory(String categoryId) {
        //standard increments:
        // 1: Makeup - Eyeshadow
        // 2: Makeup - Eyeliner
        // 3: Makeup - Blush
        // 4: Makeup - Highlighter
        // 5: Makeup - Lipstick
        // 6: Skincare - Moisturizer
        // 7: Skincare - Serum
        // 8: Skincare - SunCreams
        // 9: Haircare - HairMask
        // 10: Haircare - Oils
        // 11: Haircare - HairWax
        // 12: SpecialSets - MakeupSets
        // 13: SpecialSets - SetsForGifts

        int id = 0;
        try {
            id = Integer.parseInt(categoryId);
        } catch (NumberFormatException e) {
            return new CategoryMapping("Uncategorized", "General");
        }

        switch (id) {
            case 1:
                return new CategoryMapping("Makeup", "Eyeshadow");
            case 2:
                return new CategoryMapping("Makeup", "Eyeliner");
            case 3:
                return new CategoryMapping("Makeup", "Blush");
            case 4:
                return new CategoryMapping("Makeup", "Highlighter");
            case 5:
                return new CategoryMapping("Makeup", "Lipstick");
            case 6:
                return new CategoryMapping("Skincare", "Moisturizer");
            case 7:
                return new CategoryMapping("Skincare", "Serum");
            case 8:
                return new CategoryMapping("Skincare", "SunCreams");
            case 9:
                return new CategoryMapping("Haircare", "HairMask");
            case 10:
                return new CategoryMapping("Haircare", "Oils");
            case 11:
                return new CategoryMapping("Haircare", "HairWax");
            case 12:
                return new CategoryMapping("SpecialSets", "MakeupSets");
            case 13:
                return new CategoryMapping("SpecialSets", "SetsForGifts");
            default:
                return new CategoryMapping("Makeup", "Eyeshadow"); // Default fallback
        }
    }

    private static class CategoryMapping {
        String main;
        String sub;

        public CategoryMapping(String main, String sub) {
            this.main = main;
            this.sub = sub;
        }
    }
}
