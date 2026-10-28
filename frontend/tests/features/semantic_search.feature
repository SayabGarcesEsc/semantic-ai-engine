Feature: Enterprise Semantic Knowledge Engine Regression
  As an AI Engineer
  I want to make queries against my indexed unstructured data documents
  So that I get accurate context-aware responses

  @Regression
  Scenario: Querying semantic engine yields a valid vector model result
    Given the user opens the Semantic Dashboard interface
    When the user inputs "What are the TCS compliance terms?" into the search box
    And clicks the "Send" submission button
    Then the interface should show a chat card containing an AI answer
    And the data source badge indicator should show "vector_engine"
