import { test, expect, type Locator } from '@playwright/test';

// --- Константы ---
const HAR_INGREDIENTS = 'tests/hars/ingredients.har';
const HAR_USER = 'tests/hars/user.har';
const HAR_ORDERS = 'tests/hars/order.har';

test.describe('Функционал конструктора бургеров', () => {
  // Объявляем локаторы на уровне блока, чтобы они были доступны во всех тестах
  let modal: Locator;
  let overlay: Locator;
  let cardBun: Locator;
  let cardSauce: Locator;
  let cardMeat: Locator;
  let cardCheese: Locator;
  let areaConstructor: Locator;
  let areaIngredients: Locator;

  test.beforeEach(async ({ page }) => {
    // Подменяем запрос за ингредиентами
    await page.routeFromHAR(HAR_INGREDIENTS, {
      url: '**/api/ingredients',
      update: false,
    });

    await page.goto('/');
    // Ждем, пока прогрузятся данные с сервера
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    // Инициализируем локаторы
    modal = page.getByTestId('modal');
    overlay = page.getByTestId('modal-overlay');
    cardBun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    cardSauce = page
      .locator('li')
      .filter({ hasText: 'Соус традиционный галактический' });
    cardMeat = page.locator('li').filter({ hasText: 'Говяжий метеорит (отбивная)' });
    cardCheese = page.locator('li').filter({ hasText: 'Сыр с астероидной плесенью' });

    areaConstructor = page.locator('section').filter({ hasText: 'Оформить заказ' });
    areaIngredients = page.locator('section').filter({ hasText: 'Оформить заказ' });
  });

  test('Добавление ингредиентов из меню в конструктор', async () => {
    await test.step('Добавляем булочку', async () => {
      await cardBun.getByRole('button', { name: 'Добавить' }).click();
      await expect(
        areaConstructor.getByText('Краторная булка N-200i (верх)')
      ).toBeVisible();
      await expect(
        areaConstructor.getByText('Краторная булка N-200i (низ)')
      ).toBeVisible();
    });

    await test.step('Добавляем соус', async () => {
      await cardSauce.getByRole('button', { name: 'Добавить' }).click();
      await expect(
        areaIngredients.getByText('Соус традиционный галактический')
      ).toBeVisible();
    });

    await test.step('Добавляем мясо и сыр', async () => {
      await cardMeat.getByRole('button', { name: 'Добавить' }).click();
      await cardCheese.getByRole('button', { name: 'Добавить' }).click();

      await expect(
        areaIngredients.getByText('Говяжий метеорит (отбивная)')
      ).toBeVisible();
      await expect(
        areaIngredients.getByText('Сыр с астероидной плесенью')
      ).toBeVisible();
    });
  });

  test('Открытие и закрытие модального окна ингредиента', async () => {
    await test.step('Открываем модалку кликом по карточке', async () => {
      await cardBun.getByRole('link').click();
      await expect(modal).toBeVisible();
      await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
      await expect(modal.getByText('Калории, ккал')).toBeVisible();
    });

    await test.step('Закрываем модалку через крестик', async () => {
      await modal.getByLabel('Закрыть').click();
      await expect(modal).toBeHidden();
    });
  });

  test('Закрытие модального окна кликом по оверлею', async () => {
    await cardSauce.getByRole('link').click();
    await expect(modal).toBeVisible();

    // Кликаем в левый верхний угол оверлея (чтобы точно не попасть по модалке)
    await overlay.click({ position: { x: 10, y: 10 } });

    await expect(modal).toBeHidden();
  });

  test('Проверка корректности данных в модальном окне', async () => {
    const expectedName = 'Соус традиционный галактический';

    await cardSauce.getByRole('link').click();
    await expect(modal).toBeVisible();

    // Проверяем, что открылся именно соус, а не булка
    await expect(modal.getByText(expectedName)).toBeVisible();
    await expect(modal.getByText('Краторная булка N-200i')).toBeHidden();
  });

  test('Успешное оформление заказа и очистка конструктора', async ({
    page,
    context,
  }) => {
    await test.step('Подготовка моков для авторизации и заказа', async () => {
      await page.routeFromHAR(HAR_USER, { url: '**/api/auth/user', update: false });
      await page.routeFromHAR(HAR_ORDERS, { url: '**/api/orders', update: false });
    });

    await test.step('Установка фейковых токенов', async () => {
      await context.addCookies([
        {
          name: 'accessToken',
          value: 'fake-token',
          domain: 'localhost',
          path: '/',
        },
      ]);
      await page.addInitScript(() => {
        localStorage.setItem('refreshToken', 'fake-refresh-token');
      });
    });

    await test.step('Перезагрузка страницы с новыми токенами', async () => {
      await page.reload();
      await expect(page.getByText('Краторная булка N-200i').first()).toBeVisible();
      // Имя в шапке появляется после успешного ответа /auth/user
      await expect(page.getByText('Test User')).toBeVisible();
    });

    await test.step('Сборка бургера', async () => {
      await cardBun.getByRole('button', { name: 'Добавить' }).click();
      await cardMeat.getByRole('button', { name: 'Добавить' }).click();
      await cardSauce.getByRole('button', { name: 'Добавить' }).click();
    });

    await test.step('Отправка заказа', async () => {
      await page.getByRole('button', { name: 'Оформить заказ' }).click();
    });

    await test.step('Проверка модального окна с номером заказа', async () => {
      await expect(modal).toBeVisible();
      await expect(modal.getByText('идентификатор заказа')).toBeVisible();
      await expect(modal.getByText('99999')).toBeVisible();
    });

    await test.step('Проверка очистки конструктора после заказа', async () => {
      await expect(page.getByText('Выберите булки').first()).toBeVisible();
      await expect(areaIngredients.getByText('Выберите начинку')).toBeVisible();
    });

    await test.step('Закрытие модалки с заказом', async () => {
      await modal.getByLabel('Закрыть').click();
      await expect(modal).toBeHidden();
    });
  });
});
