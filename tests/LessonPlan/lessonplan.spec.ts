import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import logger from '../helpers/utils/logger';
import { waitForToast } from '../helpers/utils/ui';
import { checkIsActiveCheckbox, clickCreateButton, clickSaveButton, navigateToMenu } from '../helpers/actions/common_actions';

test.describe('Lesson plan', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Login to the app', async () => {
            logger.info('Logging in...');
            await login(page);
            logger.info('Login successful.');
        });
    });

    test('should create lesson plan', async ({ page }) => {

    await test.step('Navigate to Lesson Plans menu', async () => {
        await navigateToMenu(page, ['lesson', 'Curriculum', 'Lesson Plans']);
        });

        await test.step('Click Create button in Lesson Plans', async () => {
            console.log('Looking for Create icon in Lesson Plans section...');

            // Find the 'Lesson Plans' label text
            const lessonPlansSection = page.locator('text=Lesson Plans').first();

            // Locate the 'Create' icon following it
            const createButton = lessonPlansSection.locator('xpath=following::i[@title="Create"][1]');

            await expect(createButton).toBeVisible({ timeout: 15000 });
            await createButton.scrollIntoViewIfNeeded();
            await expect(createButton).toBeEnabled();
            await createButton.click({ delay: 100 });

            console.log('Clicked Create button for Lesson Plans successfully.');
            });

    await test.step('selecting academic year', async () => {
            logger.info('Filling in fee details...');

            logger.info('Opening Academic Year dropdown...');
            // First, locate the specific dropdown component by its unique ng-model attribute.
            const academicYearDropdown = page.locator('[ng-model="General.AcademicYear"]');

            // Then, within that specific component, find the clickable element by its ARIA label.
            await academicYearDropdown.getByLabel('Select box select').click();

            logger.info('Selecting Academic Year...');
            // Use getByText for option selection as it was provided by codegen and seems to work.
            const academicOption = page.locator('.ui-select-choices-row-inner', { hasText: 'Meshaf (2025-2026) (2026)' }).first();
            await academicOption.click();

            logger.info('Verifying Academic Year selection...');
            // Verify that the selected text is now displayed in the dropdown.
            await expect(academicYearDropdown.locator('.select2-chosen', { hasText: 'Meshaf (2025-2026) (2026)' })).toBeVisible();
    });

    await test.step('selecting class', async () => {
            logger.info('Selecting Class...');
            const classDropdown = page.locator('[ng-model="General.Class"]');
            await classDropdown.getByLabel('Select box select').click();

            const classOption = page.locator('.ui-select-choices-row-inner', { hasText: 'Class 1 - Meshaf' }).first();
            await classOption.click();
            logger.info('Verifying Class selection...');
            await expect(classDropdown.locator('.select2-chosen', { hasText: 'Class 1 - Meshaf' })).toBeVisible();
            
    }); 
    await test.step('Selecting section using roles', async () => {
        logger.info('Selecting section using role locators...');

        // Open dropdown by targeting combobox inside the Section container
        const combobox = page.getByRole('combobox', { name: 'Select box' });
        await expect(combobox).toBeVisible({ timeout: 10000 });
        await combobox.click({ delay: 100 });

        // Wait for dropdown options to render
        const sectionToSelect = 'MA';
        const option = page.getByRole('option', { name: sectionToSelect });
        await expect(option).toBeVisible({ timeout: 10000 });

        // Select the option
        await option.click({ delay: 100 });

        logger.info(`✅ Section '${sectionToSelect}' selected successfully.`);
    });

    await test.step('selecting subject', async () => {
            logger.info('Selecting Subject...');
            const subjectDropdown = page.locator('[ng-model="General.Subject"]');
            await subjectDropdown.getByLabel('Select box select').click();
            const subjectOption = page.locator('.ui-select-choices-row-inner', { hasText: 'English' }).first();
            await subjectOption.click();
            logger.info('Verifying Subject selection...');
            await expect(subjectDropdown.locator('.select2-chosen', { hasText: 'English' })).toBeVisible();
    });

    await test.step('filling Date from ', async () => {
            logger.info('Filling Date From...');
            const dateFromInput = page.locator('input[ng-model="General.PeriodFrom"]');
            await dateFromInput.fill('2024-06-10');
            logger.info('Date From filled successfully.');
    });
    await test.step('filling Date to ', async () => {
            logger.info('Filling Date To...');
            const dateToInput = page.locator('input[ng-model="General.PeriodTo"]');
            await dateToInput.fill('2024-06-15');
            logger.info('Date To filled successfully.');
    });

    await test.step('selecting teacher with valid data', async () => {
        // --- Define the valid teacher data we found in the network response ---
        const validTeacherName = 'EP1021 - ANEESA  NISAMUDHEEN';
        const validTeacherCode = 'EP1021';

        logger.info(`Attempting to select teacher: ${validTeacherName}`);

        // 1. Locate the main dropdown container for the teacher field.
        const teacherDropdownContainer = page.locator('[ng-model="General.Teacher"]');
        
        // 2. Click the main visible part of the dropdown to open it.
        await teacherDropdownContainer.locator('a.select2-choice').click();
        logger.info('Teacher dropdown opened.');

        // 3. Find the VISIBLE search input and fill it with the valid teacher code.
        const searchInput = page.locator('div.ui-select-dropdown input.ui-select-search:visible');
        await searchInput.fill(validTeacherCode);
        logger.info(`Filled search input with: "${validTeacherCode}"`);

        // 4. Locate the correct teacher option in the results list using the full name.
        const teacherOption = page.locator('.ui-select-choices-row-inner', { hasText: validTeacherName });
        
        // 5. Explicitly wait for this option to appear. This is the crucial step.
        // Because we are now using valid data, this step should pass.
        await teacherOption.waitFor({ state: 'visible', timeout: 10000 });
        logger.info(`Found teacher option "${validTeacherName}" in the list.`);
        
        // 6. Click the option to select it.
        await teacherOption.click();
        logger.info('Clicked the teacher option.');

        // 7. Verify that the dropdown's main display has been updated correctly.
        const selectedTeacherDisplay = teacherDropdownContainer.locator('.select2-chosen:visible');
        await expect(selectedTeacherDisplay).toHaveText(validTeacherName, { timeout: 5000 });
        logger.info('SUCCESS: Teacher dropdown correctly shows the selected teacher.');
    });

    await test.step('Click on Lesson Plan Tab', async () => {
        logger.info('Clicking the "Lesson Plan" tab to view its content...');

        // This part is correct - it clicks the tab link.
        const lessonPlanTab = page.getByRole('link', { name: 'Lesson Plan', exact: true });
        await lessonPlanTab.click();
        
        logger.info('Successfully clicked the "Lesson Plan" tab.');

        // --- THIS IS THE CORRECTED VERIFICATION STEP ---
        // We now use a more specific locator to uniquely identify the tab panel.
        const lessonPlanPanel = page.locator('#kt_app_content #LessonPlan');
        
        // This assertion should now pass because the locator points to exactly one element.
        await expect(lessonPlanPanel).toBeVisible();
        logger.info('Verification successful: The Lesson Plan tab panel is visible.');
    });
    //next click this button <button class="btn btn-success btn-sm mx-2" ng-click="addRow()">

    await test.step('Click Add Lesson Plan button', async () => {
        logger.info('Clicking the "Add Lesson Plan" button...');
        const addLessonPlanButton = page.locator('button.btn.btn-success.btn-sm.mx-2', { hasText: 'Add Lesson Plan' });
        await expect(addLessonPlanButton).toBeVisible({ timeout: 10000 });
        await addLessonPlanButton.click();
        logger.info('Clicked the "Add Lesson Plan" button successfully.');
    });

    await test.step('Click first expand button in lesson plan table', async () => {
        logger.info('Clicking the first expand button (with chevron icon) in the lesson plan table...');
        // Find the first expand button that contains the chevron icon and is not hidden
        const expandButton = page.locator('button.btn.btn-sm:has(i.fa.fa-chevron-up, i.fa.fa-chevron-down)').filter({ has: page.locator('i.fa.fa-chevron-up, i.fa.fa-chevron-down') }).first();
        await expect(expandButton).toBeVisible({ timeout: 10000 });
        await expandButton.click();
        logger.info('Clicked the first expand button with chevron icon successfully.');
    });

    await test.step('inputing title', async () => {
        logger.info('Inputting title in the expanded lesson plan row...');
        const titleInput = page.locator('input[ng-model="item.LessonName"]');
        await titleInput.fill('Introduction to Playwright Testing');
        logger.info('Title input successfully.');
    });

    await test.step('inputing number of periods', async () => {
        logger.info('Inputting number of periods in the expanded lesson plan row...');
        const periodsInput = page.locator('input[ng-model="item.NumberOfPeriods"]');
        await periodsInput.fill('5');
        logger.info('Number of periods input successfully.');
    });

    await test.step('selecting a chapter from the dropdown', async () => {
        // Define the chapter we want to select from the list.
        const chapterToSelect = 'Matter-Nature and Behaviour';
        logger.info(`Selecting chapter: "${chapterToSelect}"...`);

        // 1. First, locate the dropdown container itself using its unique ng-model.
        //    IMPORTANT: This assumes we are still scoped within the correct expanded row.
        //    If you are not chaining locators from the row, you might need to make this more specific.
        const chapterDropdownContainer = page.locator('div[ng-model="item.Chapter"]');

        // 2. Click the main part of the dropdown to open the list of options.
        await chapterDropdownContainer.locator('a.select2-choice').click();
        logger.info('Chapter dropdown opened.');

        // 3. Locate the specific chapter option by its text from the now-visible list.
        //    The list of options often appears at the bottom of the page, not inside the dropdown container,
        //    so we use page.locator() here.
        const chapterOption = page.locator('.ui-select-choices-row-inner', { hasText: chapterToSelect });

        // 4. Click the desired chapter to select it.
        await chapterOption.click();
        logger.info('Clicked the chapter option.');

        // 5. (Recommended) Verify that the dropdown now displays the selected chapter.
        //    This confirms the click was successful.
        const selectedChapterDisplay = chapterDropdownContainer.locator('.select2-chosen:visible');
        await expect(selectedChapterDisplay).toHaveText(chapterToSelect, { timeout: 5000 });
        logger.info('SUCCESS: Chapter dropdown correctly shows the selected chapter.');
    });

    await test.step('selecting a unit', async () => {
        // Define the unit we want to select from the list.
        const unitToSelect = 'unit 1';
        logger.info(`Selecting unit: "${unitToSelect}"...`);
        // 1. First, locate the dropdown container itself using its unique ng-model.
        const unitDropdownContainer = page.locator('div[ng-model="item.SubjectUnit"]');
        
        await unitDropdownContainer.locator('a.select2-choice').click();
        logger.info('Unit dropdown opened.');

        // 3. Locate the specific unit option by its text from the now-visible list.
        const unitOption = page.locator('.ui-select-choices-row-inner', { hasText: unitToSelect });
        await unitOption.click();
        logger.info('Clicked the unit option.');
        const selectedUnitDisplay = unitDropdownContainer.locator('.select2-chosen:visible');
        await expect(selectedUnitDisplay).toHaveText(unitToSelect, { timeout: 5000 });
        logger.info('SUCCESS: Unit dropdown correctly shows the selected unit.');
    });
    });
    
    test('create lesson outcome', async ({ page }) => {
        logger.info('creating lesson outcome  ...');

        await test.step('Navigate to Lesson Plans menu', async () => {
            await navigateToMenu(page, ['lesson', 'Curriculum', 'Lesson Outcome']);
            });

        //click create button
        await test.step('clicking create lesson outcome button', async () => {
            logger.info('Clicking Create button in Lesson Outcome section...');
            await clickCreateButton( page, 'Create Lesson Outcome');
        });


        await test.step('inputting lesson outcome ', async () => {
            logger.info('Inputting lesson outcome details...');
            const lessonOutcomeInput = page.locator('input[ng-model="CRUDModel.ViewModel.LessonLearningOutcomeName"]');
            await expect(lessonOutcomeInput).toBeVisible({ timeout: 10000 });
            await lessonOutcomeInput.fill('Understand the basics of Playwright automation testing.');
            logger.info('Lesson outcome input successfully.');
        });

        await test.step('Check Is Active', async () => {
            await checkIsActiveCheckbox(page);
        });

        await test.step('Save lesson outcome', async () => {
            await clickSaveButton(page);
        });
    });

    test('create leeson objective', async ({ page }) => {
        logger.info('creating lesson objective  ...');

        await test.step('Navigate to Lesson Plans menu', async () => {
            await navigateToMenu(page, ['lesson', 'Curriculum', 'Lesson Objective']);
            });
        //click create button
        await test.step('clicking create lesson objective button', async () => {
            logger.info('Clicking Create button in Lesson Objective section...');
            await clickCreateButton( page, 'Create Lesson Objective');
        });

        await test.step('inputting lesson objective ', async () => {
            logger.info('Inputting lesson objective details...');
            const lessonObjectiveInput = page.locator('input[ng-model="CRUDModel.ViewModel.LessonLearningObjectiveName"]');
            await expect(lessonObjectiveInput).toBeVisible({ timeout: 10000 });
            await lessonObjectiveInput.fill('Learn how to create automated tests using Playwright.');
            logger.info('Lesson objective input successfully.');
        });
        await test.step('Check Is Active', async () => {
            await checkIsActiveCheckbox(page);
            logger.info('Is Active checkbox checked successfully in Lesson Objective.');
        });
        await test.step('Save lesson objective', async () => {
            await clickSaveButton(page);    
            logger.info('Lesson objective saved successfully.');
        });
    });

    test('Lesson plan report', async ({ page }) => {
        logger.info('Generating Lesson Plan report...');
        await test.step('Navigate to Lesson Plan Report menu', async () => {
            await navigateToMenu(page, ['lesson', 'Reports', 'Schools Reports','Lesson Plan']);
            });
        await test.step('Filling report filters', async () => {
            await test.step('Selecting Class from dropdown', async () => {
                logger.info('Selecting Section...');
                const classDropdown = page.locator('[ng-model="ParameterModel.ClassID"]');
                await classDropdown.getByLabel('Select box select').click();
                const classOption = page.locator('.ui-select-choices-row-inner', { hasText: 'Class 1' }).first();
                await classOption.click();
                logger.info('Verifying Section selection...');
                await expect(classDropdown.locator('.select2-chosen', { hasText: 'Class 1' })).toBeVisible();
            });

            await test.step('selecting section', async () => {
                logger.info('Selecting Section...');
                const sectionDropdown = page.locator('[ng-model="ParameterModel.SectionID"]');
                await sectionDropdown.getByLabel('Select box select').click();
                const sectionOption = page.locator('.ui-select-choices-row-inner', { hasText: 'MA' }).first();
                await sectionOption.click();
                logger.info('Verifying Section selection...');
                await expect(sectionDropdown.locator('.select2-chosen', { hasText: 'MA' })).toBeVisible();
            });

        });
    });
});


