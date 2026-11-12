/**
 * All the public routes
 * @type {{"GET /trx": string, "POST /trx-history": string, "GET /today-fuel": string, "POST /today-fuel": string, "POST /validate": string, "POST /trx": string, "POST /login": string}}
 */
const publicRoutes = {
    'GET /import-csv': 'ImportController.importFromCsv',

    'GET /trx': 'TrxController.getTotalFuelByFuelType',
    'POST /trx': 'TrxController.addTrx',
    'GET /trx-today': 'TrxController.getTodayTrx',
    'POST /trx-history': 'TrxController.getTrxHistory',
    'POST /trx-by-nozzle-latest': 'TrxController.recentTrxByNozzle',
    'GET /trx-postman' : 'TrxAddPostman.addTrxPostman',

    'GET /fuel-consumption': 'TrxController.getTotalFuelConsumption',

    'GET /today-fuel': 'FuelController.getTodayFuel',
    'POST /today-fuel': 'FuelController.addTodayFuel',
    'POST /today-fuel/update': 'FuelController.updateTodayFuel',

    'GET /employees/get': 'EmployeeController.getEmployees',
    'POST /employees/add': 'EmployeeController.addEmployee',
    'POST /employees/update': 'EmployeeController.updateEmployee', // not finish
    'POST /employees/delete': 'EmployeeController.deleteEmployee',

    'GET /shifts/get': 'ShiftsController.getShifts',
    'POST /shifts/get-today': 'ShiftsController.todayEmployeeShifts',
    'POST /shifts/add': 'ShiftsController.addShift',
    'POST /shifts/update': 'ShiftsController.updateShift',
    'POST /shifts/delete': 'ShiftsController.deleteShift', // delete shift and today's Trx

    'POST /reports/newsummary/date': 'Reports/NewSummaryReportController.filterDate',
    'POST /reports/newsummary/shift': 'Reports/NewSummaryReportController.filterShift',
    'POST /reports/summary/date': 'Reports/SummaryReportController.filterDate',
    'POST /reports/summary/shift': 'Reports/SummaryReportController.filterShift',
    'POST /reports/sales/date': 'Reports/SalesReportController.filterDate',
    'POST /reports/sales/shift': 'Reports/SalesReportController.filterShift',
    'POST /reports/stock/date': 'Reports/StockReportController.filterDate',
    'POST /reports/stock/lube': 'Reports/StockReportController.filterShift',
    'POST /reports/stock/lubegrn': 'Reports/StockReportController.filterLubegrn',

    'GET /fav/get': 'FavController.getFavs',
    'POST /fav/add': 'FavController.addFavs',
    'POST /fav/update': 'FavController.updateFav',

    'GET /settings': 'SettingsController.getSettings',
    'POST /settings/save': 'SettingsController.addOrUpdate',

    'GET /export': 'ExportController.exportToFile',
};

module.exports = publicRoutes;