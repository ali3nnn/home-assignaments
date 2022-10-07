## How to run the application

#### Development mode
1. Run <code>npm ci</code>
2. Run <code>npm run startDev [argument]</code>
   - <b>argument</b> is optional and it can be a integer with minimum value of <b>3</b>. 
   - <b>argument</b> stands for the army size you want to generate.
   - If not provided, it will default to <b>167</b>.
3. After calculation you will see in the terminal the structured data with random generated size for each troop.
   - eg.: <code>{ Spearmen: 3, Swordsmen: 2, Archers: 1 }</code>
4. If you changed the code, run <code>npm run test:cov</code> to generate a test coverage report.

#### Production mode
1. Run <code>npm ci</code>
2. Run <code>npm run build</code> and generate a <code>dist</code> directory